-- IPL 2026 Seed Data
-- Run this after schema.sql

-- Insert all 10 IPL teams
INSERT INTO teams (id, name, short_name, logo_url) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Mumbai Indians', 'MI', NULL),
  ('22222222-2222-2222-2222-222222222222', 'Chennai Super Kings', 'CSK', NULL),
  ('33333333-3333-3333-3333-333333333333', 'Royal Challengers Bangalore', 'RCB', NULL),
  ('44444444-4444-4444-4444-444444444444', 'Kolkata Knight Riders', 'KKR', NULL),
  ('55555555-5555-5555-5555-555555555555', 'Delhi Capitals', 'DC', NULL),
  ('66666666-6666-6666-6666-666666666666', 'Punjab Kings', 'PBKS', NULL),
  ('77777777-7777-7777-7777-777777777777', 'Rajasthan Royals', 'RR', NULL),
  ('88888888-8888-8888-8888-888888888888', 'Sunrisers Hyderabad', 'SRH', NULL),
  ('99999999-9999-9999-9999-999999999999', 'Gujarat Titans', 'GT', NULL),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Lucknow Super Giants', 'LSG', NULL);

-- Insert sample matches for IPL 2026 (March - May)
INSERT INTO matches (match_number, team1_id, team2_id, match_date, venue, status) VALUES
  -- Week 1 - Late March
  (1, '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333',
   '2026-03-22 19:30:00+05:30', 'Wankhede Stadium, Mumbai', 'upcoming'),

  (2, '22222222-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444',
   '2026-03-23 15:30:00+05:30', 'MA Chidambaram Stadium, Chennai', 'upcoming'),

  (3, '77777777-7777-7777-7777-777777777777', '88888888-8888-8888-8888-888888888888',
   '2026-03-23 19:30:00+05:30', 'Sawai Mansingh Stadium, Jaipur', 'upcoming'),

  (4, '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666',
   '2026-03-24 19:30:00+05:30', 'Arun Jaitley Stadium, Delhi', 'upcoming'),

  (5, '99999999-9999-9999-9999-999999999999', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '2026-03-25 19:30:00+05:30', 'Narendra Modi Stadium, Ahmedabad', 'upcoming'),

  -- Week 2
  (6, '33333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222',
   '2026-03-26 19:30:00+05:30', 'M. Chinnaswamy Stadium, Bangalore', 'upcoming'),

  (7, '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111',
   '2026-03-27 19:30:00+05:30', 'Eden Gardens, Kolkata', 'upcoming'),

  (8, '88888888-8888-8888-8888-888888888888', '55555555-5555-5555-5555-555555555555',
   '2026-03-28 15:30:00+05:30', 'Rajiv Gandhi Stadium, Hyderabad', 'upcoming'),

  (9, '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777',
   '2026-03-28 19:30:00+05:30', 'PCA Stadium, Mohali', 'upcoming'),

  (10, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '33333333-3333-3333-3333-333333333333',
   '2026-03-29 19:30:00+05:30', 'BRSABV Stadium, Lucknow', 'upcoming'),

  -- Week 3
  (11, '11111111-1111-1111-1111-111111111111', '99999999-9999-9999-9999-999999999999',
   '2026-03-30 19:30:00+05:30', 'Wankhede Stadium, Mumbai', 'upcoming'),

  (12, '22222222-2222-2222-2222-222222222222', '88888888-8888-8888-8888-888888888888',
   '2026-03-31 19:30:00+05:30', 'MA Chidambaram Stadium, Chennai', 'upcoming'),

  (13, '44444444-4444-4444-4444-444444444444', '66666666-6666-6666-6666-666666666666',
   '2026-04-01 19:30:00+05:30', 'Eden Gardens, Kolkata', 'upcoming'),

  (14, '77777777-7777-7777-7777-777777777777', '55555555-5555-5555-5555-555555555555',
   '2026-04-02 19:30:00+05:30', 'Sawai Mansingh Stadium, Jaipur', 'upcoming'),

  (15, '33333333-3333-3333-3333-333333333333', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
   '2026-04-03 19:30:00+05:30', 'M. Chinnaswamy Stadium, Bangalore', 'upcoming');

-- Note: Add more matches as needed for the full IPL season
