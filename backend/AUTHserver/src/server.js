const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const config = require('../config/env');

dotenv.config();

// Schema e modello di prova
const TestSchema = new mongoose.Schema({
  messaggio: String,
  data: { type: Date, default: Date.now }
});
const TestModel = mongoose.model("Test", TestSchema);

// Connessione al database e salvataggio del dato di prova
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connesso a MongoDB Atlas");
    return TestModel.create({ messaggio: "Prova dal mio progetto!" });
  })
  .then((doc) => {
    console.log("Dato salvato su Atlas:", doc);
  })
  .catch((err) => {
    console.error("Errore connessione DB:", err);
  });
//

const paths = require('../config/paths');
const googleAuthRoutes = require(paths.ROUTES + '/authRoutes');
const session = require('express-session');
const passport = require('../config/passport');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("trust proxy", 1);
app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 8 // 8 ore
  },
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', googleAuthRoutes);

app.listen(config.AUTHSERVER_PORT, () => {
  console.log(`Service 2 (API) avviato su http://localhost:${config.AUTHSERVER_PORT}`);
});