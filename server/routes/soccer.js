const express = require("express");
const router = express.Router();
const {
  getLiveMatches,
  getTeamAverages,
} = require("../controllers/soccerController");

router.get("/live", getLiveMatches);
router.get("/averages/:teamId", getTeamAverages);

module.exports = router;
