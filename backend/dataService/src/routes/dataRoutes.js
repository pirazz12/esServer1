const express = require("express");
const {
  getProfileData,
  getMessages,
  createMessage,
  getDatabaseStatus
} = require("../controllers/dataController");

const router = express.Router();

router.get("/profile", getProfileData);
router.get("/messages", getMessages);
router.post("/messages", createMessage);
router.get("/db-status", getDatabaseStatus);
router.get("/health", (req, res) => {
  res.json({ status: "ok", service: "data-service" });
});

module.exports = router;
