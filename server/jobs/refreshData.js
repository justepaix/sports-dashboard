const cron = require("node-cron");
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

const refreshData = () => {
  // Run once per day at midnight
  cron.schedule("0 0 * * *", async () => {
    console.log("⏰ Daily data refresh...");
    try {
      await axios.get(`${BASE_URL}/soccer/live`);
      await axios.get(`${BASE_URL}/nba/live`);
      console.log("✅ Data refreshed successfully");
    } catch (error) {
      console.error("❌ Refresh failed:", error.message);
    }
  });
};

module.exports = refreshData;
