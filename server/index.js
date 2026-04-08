const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const soccerRoutes = require("./routes/soccer");
const nbaRoutes = require("./routes/nba");
const refreshData = require("./jobs/refreshData");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/soccer", soccerRoutes);
app.use("/api/nba", nbaRoutes);

app.get("/", (req, res) =>
  res.json({ message: "Sports Dashboard API running" }),
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  refreshData();
});
