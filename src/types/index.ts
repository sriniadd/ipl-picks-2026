export interface Team {
  id: string;
  name: string;
  short_name: string;
  logo_url: string | null;
}

export interface Match {
  id: string;
  match_number: number;
  team1_id: string;
  team2_id: string;
  match_date: string;
  venue: string;
  winner_id: string | null;
  status: 'upcoming' | 'live' | 'completed';
  team1?: Team;
  team2?: Team;
  winner?: Team;
}

export interface Pick {
  id: string;
  user_id: string;
  match_id: string;
  picked_team_id: string;
  confidence: 1 | 2 | 3;
  points_earned: number | null;
  created_at: string;
  match?: Match;
  picked_team?: Team;
}

export interface Profile {
  id: string;
  display_name: string;
  created_at: string;
}

export interface LeaderboardEntry {
  display_name: string;
  total_points: number;
  correct: number;
  wrong: number;
  total_picks: number;
}

export interface MatchWithTeams extends Match {
  team1: Team;
  team2: Team;
  winner: Team | null;
}

export interface PickWithDetails extends Pick {
  match: MatchWithTeams;
  picked_team: Team;
}
