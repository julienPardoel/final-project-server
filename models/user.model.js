//dans ce fichier on utilise mongoose
const mongoose = require("mongoose");

// librairie qui permet de parametrer le format de l'email
const { isEmail } = require('validator');

// on crée un modele de données pour les envoyer dans la db
const userSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 15,
      unique: true,
      trim: true, // supprime les espaces
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [isEmail],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6,
    },
    picture: {
      type: String,
      default: "./img/random-user.png",
    },
  },
  {
    timestamps: true,
  }
);

// on crée une variable qui contient notre schema
// et on l'exporte vers les fichiers ...
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;
