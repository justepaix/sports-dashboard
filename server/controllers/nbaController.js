const axios = require("axios");
const pool = require("../config/db");

const BASE_URL = "https://api.balldontlie.io/v1";

// BallDontLie v1 requires an API key too - add this to your .env
// BALLDONTLIE_KEY=your_key_here
const headers = {
  Authorization: process.env.BALLDONTLIE_KEY,
};

// Get today's games
const getLiveGames = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const response = await axios.get(
      `${BASE_URL}/games?dates[]=${today}&per_page=25`,
      { headers },
    );
    const games = response.data.data;

    if (!games.length) {
      return res.json({ message: "No NBA games today", data: [] });
    }

    for (const game of games) {
      const homeTeam = game.home_team;
      const awayTeam = game.visitor_team;

      // Upsert home team
      await pool.query(
        `INSERT INTO teams (api_id, name, sport, league)
         VALUES ($1, $2, 'nba', 'NBA')
         ON CONFLICT (api_id) DO NOTHING`,
        [homeTeam.id, homeTeam.full_name],
      );

      // Upsert away team
      await pool.query(
        `INSERT INTO teams (api_id, name, sport, league)
         VALUES ($1, $2, 'nba', 'NBA')
         ON CONFLICT (api_id) DO NOTHING`,
        [awayTeam.id, awayTeam.full_name],
      );

      const homeResult = await pool.query(
        "SELECT id FROM teams WHERE api_id = $1",
        [homeTeam.id],
      );
      const awayResult = await pool.query(
        "SELECT id FROM teams WHERE api_id = $1",
        [awayTeam.id],
      );

      // Upsert match
      await pool.query(
        `INSERT INTO matches (api_id, sport, league, home_team_id, away_team_id, home_score, away_score, status, match_date)
         VALUES ($1, 'nba', 'NBA', $2, $3, $4, $5, $6, $7)
         ON CONFLICT (api_id) DO UPDATE SET
           home_score = EXCLUDED.home_score,
           away_score = EXCLUDED.away_score,
           status = EXCLUDED.status`,
        [
          game.id,
          homeResult.rows[0].id,
          awayResult.rows[0].id,
          game.home_team_score,
          game.visitor_team_score,
          game.status,
          game.date,
        ],
      );
    }

    const matches = await pool.query(`
      SELECT m.*,
        ht.name as home_team,
        at.name as away_team
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.sport = 'nba'
      ORDER BY m.match_date DESC
    `);

    res.json({ data: matches.rows });
  } catch (error) {
    console.error("NBA API error:", error.message);
    res.status(500).json({ error: "Failed to fetch NBA games" });
  }
};

// Get last 5 games averages for an NBA team
const getTeamAverages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const result = await pool.query(
      `
      SELECT
        ROUND(AVG(s.points), 2) as avg_points,
        ROUND(AVG(s.rebounds), 2) as avg_rebounds,
        ROUND(AVG(s.assists), 2) as avg_assists,
        ROUND(AVG(s.fg_percentage), 2) as avg_fg_percentage,
        ROUND(AVG(s.three_point_percentage), 2) as avg_three_point_percentage,
        ROUND(AVG(s.turnovers), 2) as avg_turnovers
      FROM nba_stats s
      JOIN matches m ON s.match_id = m.id
      WHERE s.team_id = $1
      ORDER BY m.match_date DESC
      LIMIT 5
    `,
      [teamId],
    );

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("NBA averages error:", error.message);
    res.status(500).json({ error: "Failed to fetch NBA team averages" });
  }
};

module.exports = { getLiveGames, getTeamAverages };
