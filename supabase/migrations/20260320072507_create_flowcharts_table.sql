CREATE TABLE flowcharts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  team_id uuid REFERENCES teams(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  content jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Add indexes
CREATE INDEX flowcharts_user_id_idx ON flowcharts(user_id);
CREATE INDEX flowcharts_team_id_idx ON flowcharts(team_id);
CREATE INDEX flowcharts_updated_at_idx ON flowcharts(updated_at DESC);

-- Enable realtime
ALTER TABLE flowcharts REPLICA IDENTITY FULL;
CREATE PUBLICATION flowcharts_pub FOR TABLE flowcharts;