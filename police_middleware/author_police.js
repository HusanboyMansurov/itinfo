const { to } = require("../helpers/to_promise");
const authorJwt = require("../services/jwt_service");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(401)
        .send({ message: "Avtor ro'yxatdan o'tmagan (token topilmadi)" });
    }
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];
    if (bearer !== "Bearer" || !token) {
      return res
        .status(401)
        .send({ message: "Avtor ro'yxatdan o'tmagan (token berilmagan)" });
    }
    const [error, decodedToken] = await to(authorJwt.verifyAccessToken(token));
    if (error) {
      return res.status(401).send({ message: error.message });
    }
    // console.log(decodedToken);
    req.author = decodedToken; //keyingi darslarda tushuntiraman
    // console.log(req);
    
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send({ message: error.message });
  }
};
