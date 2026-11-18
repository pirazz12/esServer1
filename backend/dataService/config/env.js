const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

module.exports = {
  PORT: parseInt(process.env.PORT || process.env.DATA_SERVICE_PORT || "3003", 10),
  SERVICE_NAME: process.env.SERVICE_NAME || "data-service",
  MONGO_URI: process.env.MONGO_URI
};
