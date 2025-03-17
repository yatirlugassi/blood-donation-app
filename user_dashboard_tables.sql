-- DONATIONS TABLE
-- Tracks individual blood donations made by users
CREATE TABLE IF NOT EXISTS donations (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  donation_date DATE NOT NULL,
  donation_center VARCHAR(255) NOT NULL,
  blood_amount_ml INTEGER NOT NULL,
  donation_type VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for donations
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own donations
CREATE POLICY "Users can view their own donations" 
  ON donations FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own donations
CREATE POLICY "Users can insert their own donations" 
  ON donations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own donations
CREATE POLICY "Users can update their own donations" 
  ON donations FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own donations
CREATE POLICY "Users can delete their own donations" 
  ON donations FOR DELETE 
  USING (auth.uid() = user_id);

-- DONATION GOALS TABLE
-- Tracks donation goals set by users
CREATE TABLE IF NOT EXISTS donation_goals (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_count INTEGER NOT NULL,
  target_date DATE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for donation_goals
ALTER TABLE donation_goals ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own goals
CREATE POLICY "Users can view their own goals" 
  ON donation_goals FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own goals
CREATE POLICY "Users can insert their own goals" 
  ON donation_goals FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own goals
CREATE POLICY "Users can update their own goals" 
  ON donation_goals FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own goals
CREATE POLICY "Users can delete their own goals" 
  ON donation_goals FOR DELETE 
  USING (auth.uid() = user_id);

-- ACHIEVEMENTS TABLE
-- List of all possible achievements in the system
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  icon_url VARCHAR(255),
  criteria TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for achievements
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view achievements
CREATE POLICY "Anyone can view achievements" 
  ON achievements FOR SELECT 
  USING (true);

-- USER ACHIEVEMENTS TABLE
-- Junction table linking users with their earned achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id INTEGER NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Row Level Security for user_achievements
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own achievements
CREATE POLICY "Users can view their own achievements" 
  ON user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own achievements (though typically this would be done by the system)
CREATE POLICY "Users can insert their own achievements" 
  ON user_achievements FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- DONATION REMINDERS TABLE
-- Allows users to set reminders for their next donation
CREATE TABLE IF NOT EXISTS donation_reminders (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reminder_date DATE NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security for donation_reminders
ALTER TABLE donation_reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own reminders
CREATE POLICY "Users can view their own reminders" 
  ON donation_reminders FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own reminders
CREATE POLICY "Users can insert their own reminders" 
  ON donation_reminders FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reminders
CREATE POLICY "Users can update their own reminders" 
  ON donation_reminders FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own reminders
CREATE POLICY "Users can delete their own reminders" 
  ON donation_reminders FOR DELETE 
  USING (auth.uid() = user_id);

-- Add is_admin column to user_profiles (if it doesn't exist)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- Insert sample achievements
INSERT INTO achievements (name, description, icon_url, criteria)
VALUES 
  ('First Time Donor', 'Completed your first blood donation', '/images/achievements/placeholder.svg', 'Complete 1 donation'),
  ('Regular Donor', 'Completed 5 blood donations', '/images/achievements/placeholder.svg', 'Complete 5 donations'),
  ('Silver Donor', 'Completed 10 blood donations', '/images/achievements/placeholder.svg', 'Complete 10 donations'),
  ('Gold Donor', 'Completed 25 blood donations', '/images/achievements/placeholder.svg', 'Complete 25 donations'),
  ('Platinum Donor', 'Completed 50 blood donations', '/images/achievements/placeholder.svg', 'Complete 50 donations'),
  ('Diamond Donor', 'Completed 100 blood donations', '/images/achievements/placeholder.svg', 'Complete 100 donations')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_donations_user_id ON donations (user_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations (donation_date);
CREATE INDEX IF NOT EXISTS idx_donation_goals_user_id ON donation_goals (user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements (user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON user_achievements (achievement_id);
CREATE INDEX IF NOT EXISTS idx_donation_reminders_user_id ON donation_reminders (user_id);
CREATE INDEX IF NOT EXISTS idx_donation_reminders_date ON donation_reminders (reminder_date); 