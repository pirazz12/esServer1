require("dotenv").config();

module.exports = {
  PORT: parseInt(process.env.PORT || process.env.DATA_SERVICE_PORT || "3003", 10),
  SERVICE_NAME: process.env.SERVICE_NAME || "data-service"
};
