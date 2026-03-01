// const dotenv = require('dotenv');
import 'dotenv/config';
// dotenv.config();

import cors from 'cors';

// const multer = require('multer');
import multer from 'multer';
const bodyParser = multer();

// const express = require('express');
import express from 'express';
const app = express();

import session from 'express-session';
import { passport } from './app/auth.js';
import { sequelize } from './app/data/sequelize.js';

// const router = require('./app/router');
import { router } from './app/router.js';

/* //Slack/bolt
import { App } from '@slack/bolt';
const bolt = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  // Start your app
  await bolt.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})(); */

// app.use(bodyParser.none());

app.use(
  cors({
    //* "*" signifie que tous les sites ont accès à l'API
    origin: '*', //* plusieurs origines ['http://localhost:5500', 'http://localhost:5173']
    // methods: '*', // ['GET', 'PUT', 'POST', 'PATCH'] la methode `delete` ne sera pas accepter coté client
    credentials: true, //! indispensable pour le fonctionnement du csrf
    // Configures the Access-Control-Allow-Credentials CORS header.
    // Set to true to pass the header, otherwise it is omitted.
    // permet de déterminer si le serveur autorise les requêtes cross-origin à inclure des informations d'identification,
    // telles que des cookies ou des jetons d'authentification
  })
);

app.set('view engine', 'ejs');
app.set('views', './app/views');

const port = process.env.PORT || 5000;
const url = process.env.BASE_URL || `http://localhost`;

app.use(express.static('./public'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Needed for AJAX JSON form submissions
app.use(bodyParser.none());

// Setup Sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a-very-secret-key-for-revenue-in',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Sync DB models (in dev/staging context)
if (sequelize) {
  sequelize.sync({ alter: true }).then(() => {
    console.log('✅ DB tables synced successfully.');
  }).catch(err => {
    console.error('⚠️ DB Sync Failed:', err);
  });
}

app.use(router);

app.listen(port, () => {
  console.log(`App listening on ` + url + `:` + port);
});
