export interface Match {
  id: number;
  api_id: number;
  sport: string;
  league: string;
  home_team: string;
  away_team: string;
  home_team_id: number;
  away_team_id: number;
  home_score: number;
  away_score: number;
  home_logo?: string;
  away_logo?: string;
  status: string;
  match_date: string;
}

export interface SoccerAverages {
  avg_goals: number;
  avg_corners: number;
  avg_yellow_cards: number;
  avg_red_cards: number;
  avg_possession: number;
  avg_shots_on_target: number;
}

export interface NBAaverages {
  avg_points: number;
  avg_rebounds: number;
  avg_assists: number;
  avg_fg_percentage: number;
  avg_three_point_percentage: number;
  avg_turnovers: number;
}
