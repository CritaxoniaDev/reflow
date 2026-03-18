-- Users table linked to Supabase auth
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  token TEXT, -- OTP token for magic link
  token_expires_at TIMESTAMPTZ, -- Expiration time for OTP
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_token ON users(token);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Users can read their own data"
ON users FOR SELECT
USING (auth.uid() = id);

-- Allow insert for new users (for signup)
CREATE POLICY "Anyone can insert a user"
ON users FOR INSERT
WITH CHECK (true);

-- Allow update for authenticated users
CREATE POLICY "Users can update their own data"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Allow delete for authenticated users
CREATE POLICY "Users can delete their own data"
ON users FOR DELETE
USING (auth.uid() = id);