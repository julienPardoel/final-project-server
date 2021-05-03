// on importe les variables d'environnement stockées dans le fichier .env
require('dotenv').config({ path: './config/.env' });

// express : framework qui fournit des fonctionnalités
const express = require("express");

// on importe la route de l'utilisateur
const userRoutes = require('./routes/user.routes');
const commentsRoutes = require('./routes/comments.routes');

// on importe la db
require('./config/db');

const cors = require('cors');

const cookieParser = require('cookie-parser');

// on defini que la variable app utilisera express
const app = express();

app.use(cookieParser());

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  'allowedHeaders': ['sessionId', 'Content-Type'],
  'exposedHeaders': ['sessionId'],
  'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'preflightContinue': false
}

app.use(cors(corsOptions));

app.use(express.json());

app.use('/api/user', userRoutes);
app.use('/api/comments', commentsRoutes);
// envoi de la db vers une adresse sur une app locale
// utilisation d'une variable d'environement > sécurité
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
