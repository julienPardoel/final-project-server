// import de router de express afin d'assurer que les routes soit servies sur des url qu'on définit dans le index.js
const router = require('express').Router();

// on importe le fichier qui controlle l'authentification
const authController = require('../controllers/auth.controller');

const userController = require('../controllers/user.controller')

const uploadController = require('../controllers/upload.controller');

// upload image
const multer = require("multer");
const upload = multer();

// authentification
router.post('/register', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.logOut);
router.get('/', authController.getUser);

// vue utilisateurs
// router.get('/:id', userController.userInfo)
router.get('/all', userController.getAllUsers);


// gestion photo utilisateur
router.post("/upload", upload.single("file"), uploadController.uploadProfil);

//! Export du module router a réutiliser dans le index.js pour associer les routes avec un router.
module.exports = router;