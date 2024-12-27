const Description = require("../schemas/Description");

const errorHandler = (res, error) => {
  res.status(500).send({ message: `Xatolik: ${error}` });
};

const addDescription = async (req, res) => {
  try {
    const { description, category_id } = req.body;

    const newDescription = await Description({
      description,
      category_id,
    });

    await newDescription.save();
    console.log(newDescription);

    res.status(200).send({ message: "Yangi termin tavsifi qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getDescriptions = async (req, res) => {
  try {
    const descriptions = await Description.find({}).populate({
      path: "category_id",
    });

    console.log(descriptions[0].category_id.category_name);
    if (!descriptions) {
      return res
        .status(400)
        .send({ message: "Birorta ham termin tavsifi topilmadi" });
    }

    res.json({ descriptions });
  } catch (error) {
    errorHandler(res, error);
  }
};
const getDescription = async (req, res) => {
  try {
    const description = await Description.findById(req.params.id).populate(
      "category_id"
    );

    if (!description) {
      return res
        .status(400)
        .send({ message: "Bunday termin tavsifi topilmadi" });
    }
    res.json(description);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addDescription,
  getDescriptions,
  getDescription,
};
