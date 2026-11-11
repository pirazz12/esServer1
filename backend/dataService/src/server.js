const express = require("express");
const config = require("../config/env.js");
const dataRoutes = require("./routes/dataRoutes.js");

const app = express();

app.use(express.json());
app.use("/api/data", dataRoutes);

app.listen(config.PORT, () => {
  console.log(`Data service avviato su http://localhost:${config.PORT}`);
});
