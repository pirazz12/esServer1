const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const session = require('express-session');
const passport = require('../config/passport');
const config = require('../config/env');
const paths = require('../config/paths');
const googleAuthRoutes = require(paths.ROUTES + '/authRoutes');

const app = express();

dotenv.config();

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
    maxAge: 1000 * 60 * 60 * 8
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', googleAuthRoutes);

app.listen(config.AUTHSERVER_PORT, () => {
  console.log(`Service 2 (API) avviato su http://localhost:${config.AUTHSERVER_PORT}`);
});