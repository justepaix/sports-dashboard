const express = require("express");
const router = express.Router();
const {
  getLiveGames,
  getTeamAverages,
} = require("../controllers/nbaController");

router.get("/live", getLiveGames);
router.get("/averages/:teamId", getTeamAverages);

module.exports = router;
