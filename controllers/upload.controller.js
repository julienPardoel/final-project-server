const UserModel = require("../models/user.model");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const { uploadErrors } = require("../utils/errors.utils");

module.exports.uploadProfil = async (req, res) => {
  console.log(req);
  try {
    // si l'image n'est pas de se format elle est refusée
    if (
      req.file.detectedMimeType != "image/jpg" &&
      req.file.detectedMimeType != "image/png" &&
      req.file.detectedMimeType != "image/jpeg"
    )
      throw Error("invalid file");

    // si la taille de l'image est supérieure à ... elle est refusée
    if (req.file.size > 500000) throw Error("max size");
  } catch (err) {
    const errors = uploadErrors(err);
    return res.status(201).json({ errors });
  }
  const fileName = req.body.name + ".jpg";
  console.log(req);
  await pipeline(
    req.file.stream,
    fs.createWriteStream(`${__dirname}/../../client/public/img/${fileName}`)
  );
  console.log("ok");
  try {
    console.log("ok2");
    await UserModel.findByIdAndUpdate(
      req.body.userId,
      { $set: { picture: "./img/" + fileName } },
      { new: true, upsert: true, setDefaultsOnInsert: true },
      (err, docs) => {
        if (!err) return res.send(docs);
        else return res.status(500).send({ message: err });
      }
    );
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
