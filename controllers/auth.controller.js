// on importe bcrypt qui sert à encoder le password
const bcrypt = require("bcryptjs");

// dépendance servant à créer et utiliser des tokens
const jwt = require("jsonwebtoken");

// on importe le modele prédéfini
const UserModel = require("../models/user.model");

const { signUpErrors, signInErrors } = require("../utils/errors.utils");

// on exporte vers la route de la méthode POST à l'url /register qui sert de moyen d'inscription
module.exports.signUp = async (req, res) => {
  try {
    // on génère du sel pour hasher le mot de passe
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // création d'un nouvel utilisateur suivant le model défini dans le fichier user.model.js et le hashedPassword
    const user = new UserModel({
      pseudo: req.body.pseudo,
      email: req.body.email,
      password: hashedPassword,
    });

    // ajout des données dans la db
    const result = await user.save();

    const { password, ...data } = await result.toJSON();
    // réponse du serveur à l'ajout dans la db avec les infos users (sauf le password)
    res.send(data);
  } catch (err) {
    const errors = signUpErrors(err);
    res.status(200).json({ errors });
  }
};

// on exporte vers la route methode post à l'url /login pour la connexion
module.exports.signIn = async (req, res) => {

  // on vérifie que l'email existe dans db
  const user = await UserModel.findOne({ email: req.body.email });

  // si l'email n'existe pas on retourne une erreur
  if (!user) {
    return res.status(401).send({ message: "email" });
  }

  // on compare le mot de passe avec celui de la db
  // si le mot de passe est bon
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(401).send({ message: "password" });
  }

  // on crée un token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
  });

  //   on envoi en réponse le message
  res.send({
    message: "Authentification réussie",
  });
};

// on exporte la vue de l'utilisateurs
module.exports.getUser = async (req, res) => {
  // const users = await UserModel.find().select("-password");
  // res.status(200).json(users);

  try {
    // récupère mon cookie qui est présent sur la machine
    const cookie = req.cookies["jwt"];

    // je vais faire vérifier le cookie via la méthode verify de jwt -> Je vais retourner l'id utilisé pour le cookie et un id de cryptage
    const claims = await jwt.verify(cookie, process.env.TOKEN_SECRET);

    // si mon cookie n'est pas valide, je renvoie un code d'erreur 401 avec un message de non autorisation
    if (!claims) {
      return res.status(401).send({
        message: "Not authenticated",
      });
    }

    // si toutefois mon cookie est valide, je récupère l'utilisateur qui est associé à l'id du cookie
    const user = await UserModel.findOne({ _id: claims._id });

    const { password, ...data } = await user.toJSON();

    // je renvoie les infos liées à l'utilisateur authentifié
    res.send(data);
  } catch (error) {
    return res.status(401).send({
      message: "Not authenticated",
    });
  }
};

// on exporte vers la route methode post à l'url /logout pour la déconnection
module.exports.logOut = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.send({
    message: "Successfully logged out",
  });
};
