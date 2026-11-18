const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: { type: String, required: true, trim: true, maxlength: 1000 },
  author: mongoose.Schema.Types.Mixed,
  createdAt: { type: Date, default: Date.now }
});
const MessageModel = mongoose.models.Message || mongoose.model("Message", MessageSchema);

const AppSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  updatedAt: { type: Date, default: Date.now }
});
const AppSettingModel = mongoose.models.AppSetting || mongoose.model("AppSetting", AppSettingSchema);

const ChangeLogSchema = new mongoose.Schema({
  key: { type: String, required: true },
  oldValue: mongoose.Schema.Types.Mixed,
  newValue: mongoose.Schema.Types.Mixed,
  changedBy: mongoose.Schema.Types.Mixed,
  changedAt: { type: Date, default: Date.now }
});
const ChangeLogModel = mongoose.models.ChangeLog || mongoose.model("ChangeLog", ChangeLogSchema);

const getProfileData = (req, res) => {
  const payload = {
    status: "ok",
    service: "data-service",
    profile: {
      id: 1,
      name: "Mario Rossi",
      role: "admin",
      email: "mario.rossi@example.com",
      city: "Roma"
    },
    timestamp: new Date().toISOString()
  };

  res.json(payload);
};

const getMessages = async (req, res) => {
  try {
    const messages = await MessageModel.find().sort({ createdAt: -1 }).lean();
    res.json({ count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ error: error.message, messages: [] });
  }
};

const createMessage = async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";

  if (!text) {
    return res.status(400).json({ error: "Scrivi un messaggio" });
  }

  try {
    const message = await MessageModel.create({
      text,
      author: req.body.author || null
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDatabaseStatus = async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      connected: false,
      error: "MongoDB non connesso. Configura MONGO_URI nel file backend/dataService/.env",
      data: { settings: [], changes: [], messages: [] }
    });
  }

  try {
    const [settings, changes, messages] = await Promise.all([
      AppSettingModel.find().sort({ updatedAt: -1 }).lean(),
      ChangeLogModel.find().sort({ changedAt: -1 }).lean(),
      MessageModel.find().sort({ createdAt: -1 }).lean()
    ]);

    res.json({
      connected: true,
      count: settings.length + changes.length + messages.length,
      data: { settings, changes, messages }
    });
  } catch (error) {
    res.status(500).json({
      connected: false,
      error: error.message,
      data: { settings: [], changes: [], messages: [] }
    });
  }
};

module.exports = {
  getProfileData,
  getMessages,
  createMessage,
  getDatabaseStatus
};
