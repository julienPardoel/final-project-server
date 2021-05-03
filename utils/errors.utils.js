module.exports.signUpErrors = (err) => {
    let errors = { pseudo: '', email: '', password: '' }

    if (err.message.includes("pseudo"))
        errors.pseudo = "pseudo incorrect ou déjà pris";

    if (err.message.includes("email"))
        errors.email = "email incorrect";

    if (err.message.includes("password"))
        errors.password = "Le mot de passse doit faire au moins 6 caractères";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
        errors.pseudo = "cet pseudo est déja pris";

    if (err.code === 11000 && Object.keys(err.keyValue)[0].includes("email"))
        errors.email = "cet email est déja enregistré";

    return errors
};

module.exports.signInErrors = (err) => {
    let errors = { email: '', password: '' }

    if (err.message.includes("email"))
        errors.email = "email inconnu";

    if (err.message.includes("password"))
        errors.password = "le mot de passe est incorrect";

    return errors
};

module.exports.uploadErrors = (err) => {
    let errors = { format: '', maxSize: ""};
  
    if (err.message.includes('invalid file'))
      errors.format = "Format incompatible";
  
    if (err.message.includes('max size'))
      errors.maxSize = "Le fichier dépasse 500ko";
  
    return errors
  }