-- Create teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add team_id to public.users table
ALTER TABLE public.users ADD COLUMN team_id UUID REFERENCES teams(id) ON DELETE SET NULL;

-- Create initial default team
INSERT INTO teams (name) VALUES ('Personal') RETURNING id;