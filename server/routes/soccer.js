const express = require("express");
const router = express.Router();
const {
  getLiveMatches,
  getStoredMatches,
  getTeamAverages,
} = require("../controllers/soccerController");

router.get("/live", getLiveMatches);
router.get("/stored", getStoredMatches);
router.get("/averages/:teamId", getTeamAverages);

module.exports = router;
