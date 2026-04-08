const axios = require("axios");
const pool = require("../config/db");

const API_KEY = process.env.API_FOOTBALL_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY,
};

const getLiveMatches = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/fixtures?live=all`, {
      headers,
    });
    const fixtures = response.data.response;

    if (!fixtures.length) {
      return res.json({ message: "No live matches right now", data: [] });
    }

    for (const fixture of fixtures) {
      const { id, status, date } = fixture.fixture;
      const league = fixture.league.name;
      const homeTeam = fixture.teams.home;
      const awayTeam = fixture.teams.away;
      const goals = fixture.goals;

      await pool.query(
        `INSERT INTO teams (api_id, name, logo, sport, league)
         VALUES ($1, $2, $3, 'soccer', $4)
         ON CONFLICT (api_id) DO NOTHING`,
        [homeTeam.id, homeTeam.name, homeTeam.logo, league],
      );

      await pool.query(
        `INSERT INTO teams (api_id, name, logo, sport, league)
         VALUES ($1, $2, $3, 'soccer', $4)
         ON CONFLICT (api_id) DO NOTHING`,
        [awayTeam.id, awayTeam.name, awayTeam.logo, league],
      );

      const homeResult = await pool.query(
        "SELECT id FROM teams WHERE api_id = $1",
        [homeTeam.id],
      );
      const awayResult = await pool.query(
        "SELECT id FROM teams WHERE api_id = $1",
        [awayTeam.id],
      );

      await pool.query(
        `INSERT INTO matches (api_id, sport, league, home_team_id, away_team_id, home_score, away_score, status, match_date)
         VALUES ($1, 'soccer', $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (api_id) DO UPDATE SET
           home_score = EXCLUDED.home_score,
           away_score = EXCLUDED.away_score,
           status = EXCLUDED.status`,
        [
          id,
          league,
          homeResult.rows[0].id,
          awayResult.rows[0].id,
          goals.home,
          goals.away,
          status.short,
          date,
        ],
      );
    }

    const matches = await pool.query(`
      SELECT m.*, 
        ht.name as home_team, ht.logo as home_logo,
        at.name as away_team, at.logo as away_logo
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.sport = 'soccer'
      ORDER BY m.match_date DESC
    `);

    res.json({ data: matches.rows });
  } catch (error) {
    console.error("Soccer API error:", error.message);
    res.status(500).json({ error: "Failed to fetch live matches" });
  }
};

const getStoredMatches = async (req, res) => {
  try {
    const matches = await pool.query(`
      SELECT m.*, 
        ht.name as home_team, ht.logo as home_logo,
        at.name as away_team, at.logo as away_logo
      FROM matches m
      JOIN teams ht ON m.home_team_id = ht.id
      JOIN teams at ON m.away_team_id = at.id
      WHERE m.sport = 'soccer'
      ORDER BY m.match_date DESC
    `);

    res.json({ data: matches.rows });
  } catch (error) {
    console.error("DB fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch matches" });
  }
};

const getTeamAverages = async (req, res) => {
  try {
    const { teamId } = req.params;

    const result = await pool.query(
      `
      SELECT 
        ROUND(AVG(s.goals), 2) as avg_goals,
        ROUND(AVG(s.corners), 2) as avg_corners,
        ROUND(AVG(s.yellow_cards), 2) as avg_yellow_cards,
        ROUND(AVG(s.red_cards), 2) as avg_red_cards,
        ROUND(AVG(s.possession), 2) as avg_possession,
        ROUND(AVG(s.shots_on_target), 2) as avg_shots_on_target
      FROM soccer_stats s
      JOIN matches m ON s.match_id = m.id
      WHERE s.team_id = $1
      ORDER BY m.match_date DESC
      LIMIT 5
    `,
      [teamId],
    );

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Team averages error:", error.message);
    res.status(500).json({ error: "Failed to fetch team averages" });
  }
};

module.exports = { getLiveMatches, getStoredMatches, getTeamAverages };
