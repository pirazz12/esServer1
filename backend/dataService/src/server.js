const express = require("express");
const mongoose = require("mongoose");
const config = require("../config/env.js");
const dataRoutes = require("./routes/dataRoutes.js");

const app = express();

app.use(express.json());
app.use("/api/data", dataRoutes);

if (!config.MONGO_URI) {
  console.error("MONGO_URI non configurata nel file backend/dataService/.env");
} else {
  mongoose
    .connect(config.MONGO_URI)
    .then(() => console.log("Connesso a MongoDB Atlas dal dataService"))
    .catch((error) => console.error("Errore connessione MongoDB:", error));
}

app.listen(config.PORT, () => {
  console.log(`Data service avviato su http://localhost:${config.PORT}`);
});
