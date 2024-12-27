const { errorHandler } = require("../helpers/error_handler");
const Author = require("../schemas/Author");
const { authorValidation } = require("../validations/author.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const authorJwt = require("../services/jwt_service");
const { to } = require("../helpers/to_promise");

const uuid = require("uuid");
const mailService = require("../services/mail.service");

const addAuthor = async (req, res) => {
  try {
    const { error, value } = authorValidation(req.body);
    console.log(value);

    if (error) {
      return res.status(400).send({ message: error.message });
    }

    const author = await Author.findOne({
      email: value.email,
    });
    if (author) {
      return res.status(400).send({
        message: "Bunday Avtor avval kiritilgan",
      });
    }

    const hashedPassword = bcrypt.hashSync(value.password, 7);

    const activation_link = uuid.v4();
    const newAuthor = await Author.create({
      ...value,
      password: hashedPassword,
      activation_link,
    });

    await mailService.sendMailActivationCode(
      value.email,
      `${config.get("api_url")}/api/author/activate/${activation_link}`
    );

    res.send({
      message: "Author added",
      id: newAuthor._id,
      newAuthor,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAuthor = async (req, res) => {
  try {
    const { email, password } = req.body;
    const author = await Author.findOne({ email });
    if (!author) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const validPassword = bcrypt.compareSync(password, author.password);
    console.log(validPassword);

    if (!validPassword) {
      return res.status(401).send({ message: "Email yoki parol noto'g'ri" });
    }
    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
    };

    const tokens = authorJwt.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });
    // throw badRequest("Test")

    // try {
    //   setTimeout(function () {
    //     const err = new Error("unCaughtException error");
    //     throw err;
    //   }, 1000);
    // } catch (error) {
    //   console.log(error);
    // }

    // new Promise((_, reject) => {
    //   reject(new Error("unhandledRejection example"));
    // });

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      author_id: author._id,
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    // next()
    errorHandler(error, res);
  }
};

const logoutAuthor = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    console.log(refreshToken);
    if (!refreshToken) {
      return res.status(400).send({ message: "Token topilmadi" });
    }
    const author = await Author.findOneAndUpdate(
      { refresh_token: refreshToken },
      { refresh_token: "" },
      { new: true }
    );
    if (!author) {
      return res.status(400).send({ message: "Bunday tokenli author yo'q" });
    }
    res.clearCookie("refreshToken");
    res.send({ refreshToken: author.refresh_token });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshAuthorToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Cookie Token topilmadi" });
    }
    const [error, tokenFromCookie] = await to(
      authorJwt.verifyRefreshToken(refreshToken)
    );
    if (error) {
      return res.status(401).send({ error: error.message });
    }
    const author = await Author.findOne({ refresh_token: refreshToken });
    if (!author) {
      return res.status(404).send({ message: "Auhtor not found" });
    }
    const payload = {
      id: author._id,
      email: author.email,
      is_active: author.is_active,
    };

    const tokens = authorJwt.generateTokens(payload);
    author.refresh_token = tokens.refreshToken;
    await author.save();
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: config.get("refresh_token_ms"),
    });

    res.status(200).send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthors = async (req, res) => {
  try {
    const authors = await Author.find({});
    if (!authors) {
      return res.status(400).send({
        message: "Birorta avtor topilmadi",
      });
    }

    res.json({ data: authors });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAuthorByID = async (req, res) => {
  try {
    const id = req.params.id;
    const author = await Author.findById(id);

    if (!author) {
      return res.status(400).send({
        message: "Bunday avtor topilmadi",
      });
    }

    res.json(author);
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAuthor = async (req, res) => {
  try {
    const result = await Author.findOne({
      _id: id,
    });

    if (result == null)
      return res.status(400).send({ message: "Id is incorrect" });
    await Author.findByIdAndDelete(id);
    res.status(200).send({ message: "OK. Author is deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateAuthor = async (req, res) => {
  try {
    const link = req.params.link;
    const author = await Author.findOne({ activation_link: link });
    if (!author) {
      return res.status(400).send({ message: "Bunday avtor topilmadi" });
    }
    if (author.is_active) {
      return res.status(400).send({ message: "Avtor avval faollashtirilgan" });
    }
    author.is_active = true;
    await author.save();
    res.send({
      message: "Avtor faollashtirish",
      is_active: author.is_active,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addAuthor,
  getAuthors,
  getAuthorByID,
  deleteAuthor,
  loginAuthor,
  logoutAuthor,
  refreshAuthorToken,
  activateAuthor,
};
