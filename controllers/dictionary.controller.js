const {
  errorHandler,
} = require("../helpers/error_handler");
const Dictionary = require("../schemas/Dictionary");

const addTerm = async (req, res) => {
  try {
    const { term } = req.body;
    const dict = await Dictionary.findOne({
      term: new RegExp(term, "i")
    });
    if (dict) {
      return res
        .status(400)
        .send({ message: "Bunday termin bor" });
    }
    const newDictionary = await Dictionary.create({
      term,
      letter:term[0],
    });

    res.status(201).send({
      message: "Yangi termin qo'shildi",
      newDictionary,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDictionary = async (req, res) => {
  try {
    const dictionary = await Dictionary.find();
    res.send(dictionary);
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTermsByLetter = async (req, res) => {
  try {
    const letter = req.params.letter;
    const terms = await Dictionary.find({
      letter,
    });

    if (!terms) {
      return res
        .status(400)
        .send({
          message: "Birorta termin topilmadi",
        });
    }

    res.json({ terms });
  } catch (error) {
    errorHandler(error, res);
  }
};


const getTermById = async (req, res) => {
  try {
    const term = await Dictionary.findById(
      req.params.id
    );

    if (!term) {
      return res
        .status(400)
        .send({
          message: "Bunday termin topilmadi",
        });
    }
    res.json(term);
  } catch (error) {
    errorHandler(error, res);
  }
};
const getTermsByTerm = async (req, res) => {
  try {
    const term = await Dictionary.findOne({
      term: {
        $regex: req.params.term,
        $options: "i",
      },
    });

    if (!term) {
      return res
        .status(400)
        .send({
          message: "Bunday termin topilmadi",
        });
    }
    res.json(term);
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addTerm,
  getDictionary,
  getTermsByLetter,
  getTermsByTerm,
  getTermById
};
