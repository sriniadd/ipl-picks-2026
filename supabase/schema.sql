-- IPL Picks 2026 Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_number INT NOT NULL,
  team1_id UUID NOT NULL REFERENCES teams(id),
  team2_id UUID NOT NULL REFERENCES teams(id),
  match_date TIMESTAMP WITH TIME ZONE NOT NULL,
  venue TEXT NOT NULL,
  winner_id UUID REFERENCES teams(id),
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Picks table
CREATE TABLE IF NOT EXISTS picks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  picked_team_id UUID NOT NULL REFERENCES teams(id),
  confidence INT NOT NULL CHECK (confidence IN (1, 2, 3)),
  points_earned INT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, match_id)
);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE picks ENABLE ROW LEVEL SECURITY;

-- Teams: Everyone can read
CREATE POLICY "Teams are viewable by everyone" ON teams
  FOR SELECT USING (true);

-- Matches: Everyone can read
CREATE POLICY "Matches are viewable by everyone" ON matches
  FOR SELECT USING (true);

-- Matches: Allow updates (for admin via anon key - in production use service role)
CREATE POLICY "Matches can be updated" ON matches
  FOR UPDATE USING (true);

-- Profiles: Everyone can read
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

-- Profiles: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Profiles: Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Picks: Everyone can read picks (for leaderboard)
CREATE POLICY "Picks are viewable by everyone" ON picks
  FOR SELECT USING (true);

-- Picks: Users can insert their own picks
CREATE POLICY "Users can insert own picks" ON picks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Picks: Users can update their own picks
CREATE POLICY "Users can update own picks" ON picks
  FOR UPDATE USING (auth.uid() = user_id);

-- Picks: Allow updates to points_earned (for admin scoring)
CREATE POLICY "Allow points updates" ON picks
  FOR UPDATE USING (true);

-- Create function for leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS TABLE (
  display_name TEXT,
  total_points BIGINT,
  correct BIGINT,
  wrong BIGINT,
  total_picks BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.display_name,
    COALESCE(SUM(picks.points_earned), 0)::BIGINT as total_points,
    COUNT(CASE WHEN picks.points_earned > 0 THEN 1 END)::BIGINT as correct,
    COUNT(CASE WHEN picks.points_earned < 0 THEN 1 END)::BIGINT as wrong,
    COUNT(picks.id)::BIGINT as total_picks
  FROM profiles p
  LEFT JOIN picks ON picks.user_id = p.id
  GROUP BY p.id, p.display_name
  ORDER BY total_points DESC;
END;
$$ LANGUAGE plpgsql;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_picks_user_id ON picks(user_id);
CREATE INDEX IF NOT EXISTS idx_picks_match_id ON picks(match_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date);
