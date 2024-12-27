const Synonym = require("../schemas/Synonym");
const Description = require("../schemas/Description");
const Dictionary = require("../schemas/Dictionary");

const errorHandler = (res, error) => {
  res.status(500).send(`Error : ${error}`);
};

const addSynonym = async (req, res) => {
  try {
    const { desc_id, dict_id } = req.body;
    let check = await Description.findById(desc_id);
    let check2 = await Dictionary.findById(dict_id);
    console.log(check);
    console.log(check2);
    
    if (check == null || check2 == null)
      return res
        .status(400)
        .send("Desc_id or Dict_id is Incorrect. Maybe both of them");
    const data = await Synonym({ desc_id, dict_id });
    await data.save();
    res.status(200).json("Synonym is added!");
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSynonym = async (req, res) => {
  try {
    const id = req.params.id;
    let check = await Synonym.findById(id);
    if (check == null) return res.status(400).send("Id is incorrect");
    res.status(200).send(check);
  } catch (error) {
    errorHandler(res, error);
  }
};

const getSynonyms = async (req, res) => {
  try {
    // Synonym.find({})
    //   .populate({
    //     path: "dict_id",
    //     match: { letter: "P" },
    //   })
    //   .populate({
    //     path: "category_id",
    //     match: { category_name: "Dasturlash tillari1" },
    //   })
    //   .exec(function (err, descriptions) {
    //     descriptions = descriptions.filter(function (desc) {
    //       return desc.dict_id != null && desc.category_id != null;
    //     });

    //     if (!descriptions) {
    //       return res
    //         .status(400)
    //         .send({ message: "Birorta ham termin tavsifi topilmadi" });
    //     }

    //     res.json({ descriptions });
    //   });
    const data = await Synonym.find({});

    if (data == null) return res.status(400).send("Information is not found");
    res.status(200).send(data);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateSynonym = async (req, res) => {
  try {
    const id = req.params.id;
    const { desc_id, dict_id } = req.body;
    let check = await Description.findById(desc_id);
    let check2 = await Dictionary.findById(dict_id);
    if (check == null || check2 == null)
      return res
        .status(400)
        .send("Desc_id or Dict_id is Incorrect. Maybe both of them");
    await Synonym.findByIdAndUpdate({ _id: id }, { desc_id, dict_id });
    res.status(200).send("Ok. Synonyminfo was updated");
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteSynonym = async (req, res) => {
  try {
    const id = req.params.id;
    let idData = await Synonym.findOne({ id });
    if (idData == null) return res.status(400).send("Id is incorrect");
    await Synonym.findByIdAndDelete(id);
    res.status(200).send("Ok. synonymInfo was deleted");
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  getSynonym,
  getSynonyms,
  addSynonym,
  updateSynonym,
  deleteSynonym,
};
