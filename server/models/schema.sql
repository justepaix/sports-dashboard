-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  api_id INTEGER UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255),
  sport VARCHAR(20) NOT NULL, -- 'soccer' or 'nba'
  league VARCHAR(100),
  country VARCHAR(100)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  api_id INTEGER UNIQUE NOT NULL,
  sport VARCHAR(20) NOT NULL,
  league VARCHAR(100),
  home_team_id INTEGER REFERENCES teams(id),
  away_team_id INTEGER REFERENCES teams(id),
  home_score INTEGER,
  away_score INTEGER,
  status VARCHAR(50),
  match_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Soccer stats table (per match)
CREATE TABLE IF NOT EXISTS soccer_stats (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  team_id INTEGER REFERENCES teams(id),
  goals INTEGER DEFAULT 0,
  corners INTEGER DEFAULT 0,
  yellow_cards INTEGER DEFAULT 0,
  red_cards INTEGER DEFAULT 0,
  possession INTEGER DEFAULT 0,
  shots INTEGER DEFAULT 0,
  shots_on_target INTEGER DEFAULT 0
);

-- NBA stats table (per match)
CREATE TABLE IF NOT EXISTS nba_stats (
  id SERIAL PRIMARY KEY,
  match_id INTEGER REFERENCES matches(id),
  team_id INTEGER REFERENCES teams(id),
  points INTEGER DEFAULT 0,
  rebounds INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  fg_percentage DECIMAL(5,2) DEFAULT 0,
  three_point_percentage DECIMAL(5,2) DEFAULT 0,
  turnovers INTEGER DEFAULT 0
);