const express = require("express");
const { getProfileData } = require("../controllers/dataController");

const router = express.Router();

router.get("/profile", getProfileData);
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "data-service" });
});

module.exports = router;
