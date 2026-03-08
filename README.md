# IPL Picks 2026

A web application for predicting IPL 2026 match winners with confidence-based scoring.

## Features

- **User Authentication** - Sign up and login with email/password
- **Match Schedule** - View upcoming, live, and completed matches
- **Make Picks** - Select winner with confidence level (1-3 points)
- **Points System**:
  - Correct pick: +1, +2, or +3 points (based on confidence)
  - Wrong pick: -1, -2, or -3 points (loses wagered points)
- **Leaderboard** - Compete against other users
- **Admin Panel** - Update match results (secret URL)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL + Auth)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Setup

### 1. Clone and Install

```bash
cd ipl-picks-2026
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to SQL Editor and run `supabase/schema.sql`
3. Then run `supabase/seed.sql` to add teams and sample matches

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
ADMIN_SECRET_KEY=your_secret_admin_key
```

Find your Supabase URL and anon key in: Project Settings > API

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

- `/` - Home page with match schedule and picks
- `/login` - Sign in
- `/register` - Create account
- `/leaderboard` - Rankings
- `/my-picks` - Your pick history
- `/admin?key=SECRET` - Admin panel to update results

## Admin Usage

1. Set `ADMIN_SECRET_KEY` in your environment variables
2. Access admin panel at `/admin?key=YOUR_SECRET_KEY`
3. Click team buttons to set match winners
4. Points are automatically calculated for all users

## Deployment to Vercel

1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## License

MIT
