const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('../../config/passport');
const config = require('../../config/env');

const TestSchema = new mongoose.Schema({
  messaggio: String,
  data: { type: Date, default: Date.now }
});
const TestModel = mongoose.models.Test || mongoose.model('Test', TestSchema);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google rimanda qui. Se il login riesce NON restituiamo il JSON di Google:
// la sessione contiene già l'utente, quindi riportiamo il browser sul sito.
// Sarà la navbar a chiedere /me per sapere chi è loggato.
router.get("/google/callback",
  passport.authenticate("google", {
    //failureRedirect: "/login",
    failureRedirect: `${config.FRONTEND_URL}`,
  }),
  (req, res) => {
    //console.log(req.user);
    //res.json(req.user);
    res.redirect(config.FRONTEND_URL);
  }
);
router.get('/me', (req, res) => {
  res.set("Cache-Control", "no-store");
  if(!req.isAuthenticated()) {
    return res.json({ authenticated: false});
  }
  res.json({
    authenticated: true,
    firstName: req.user.firstName,
  });
});

router.get('/db-status', async (req, res) => {
  try {
    const data = await TestModel.find().sort({ data: -1 }).lean();
    res.json({
      connected: true,
      count: data.length,
      data
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message,
      data: []
    });
  }
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect(config.FRONTEND_URL);
    });
  });
});

module.exports = router;
