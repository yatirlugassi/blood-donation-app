-- Create tables for Blood Donation Awareness Application

-- 1. User Profiles Table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  blood_type VARCHAR(3),
  region VARCHAR(100),
  donation_count INT DEFAULT 0,
  last_donation_date TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
  ON user_profiles FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id AND auth.users.email LIKE '%@admin.blooddonation.org'
    )
  );

-- 2. Blood Types Table
CREATE TABLE blood_types (
  id SERIAL PRIMARY KEY,
  type VARCHAR(3) NOT NULL UNIQUE,
  description TEXT
);

-- Make blood_types readable by anyone
ALTER TABLE blood_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blood types are viewable by everyone" 
  ON blood_types FOR SELECT 
  USING (true);

-- 3. Blood Compatibility Table
CREATE TABLE blood_compatibility (
  id SERIAL PRIMARY KEY,
  donor_type VARCHAR(3) NOT NULL REFERENCES blood_types(type),
  recipient_type VARCHAR(3) NOT NULL REFERENCES blood_types(type),
  compatible BOOLEAN NOT NULL,
  UNIQUE(donor_type, recipient_type)
);

-- Make blood_compatibility readable by anyone
ALTER TABLE blood_compatibility ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blood compatibility is viewable by everyone" 
  ON blood_compatibility FOR SELECT 
  USING (true);

-- 4. Regional Blood Data Table
CREATE TABLE regional_blood_data (
  id SERIAL PRIMARY KEY,
  region VARCHAR(100) NOT NULL UNIQUE,
  population BIGINT,
  a_positive DECIMAL,
  a_negative DECIMAL,
  b_positive DECIMAL,
  b_negative DECIMAL,
  ab_positive DECIMAL,
  ab_negative DECIMAL,
  o_positive DECIMAL,
  o_negative DECIMAL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Make regional_blood_data readable by anyone
ALTER TABLE regional_blood_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Regional blood data is viewable by everyone" 
  ON regional_blood_data FOR SELECT 
  USING (true);

-- 5. Quiz Questions Table
CREATE TABLE quiz_questions (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer VARCHAR(1) NOT NULL,
  explanation TEXT,
  category VARCHAR(50),
  difficulty VARCHAR(20)
);

-- Make quiz_questions readable by anyone
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Quiz questions are viewable by everyone" 
  ON quiz_questions FOR SELECT 
  USING (true);

-- 6. Quiz Results Table
CREATE TABLE quiz_results (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  score INT NOT NULL,
  max_score INT NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policy for quiz_results
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own quiz results" 
  ON quiz_results FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own quiz results" 
  ON quiz_results FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 7. Insert Blood Types Data
INSERT INTO blood_types (type, description)
VALUES 
  ('A+', 'A positive blood type'),
  ('A-', 'A negative blood type'),
  ('B+', 'B positive blood type'),
  ('B-', 'B negative blood type'),
  ('AB+', 'AB positive blood type'),
  ('AB-', 'AB negative blood type'),
  ('O+', 'O positive blood type'),
  ('O-', 'O negative blood type');

-- 8. Insert Blood Compatibility Data
-- Donors for A+
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('A+', 'A+', true),
  ('A+', 'AB+', true),
  ('A+', 'B+', false),
  ('A+', 'B-', false),
  ('A+', 'AB-', false),
  ('A+', 'A-', false),
  ('A+', 'O+', false),
  ('A+', 'O-', false);

-- Donors for A-
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('A-', 'A+', true),
  ('A-', 'A-', true),
  ('A-', 'AB+', true),
  ('A-', 'AB-', true),
  ('A-', 'B+', false),
  ('A-', 'B-', false),
  ('A-', 'O+', false),
  ('A-', 'O-', false);

-- Donors for B+
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('B+', 'B+', true),
  ('B+', 'AB+', true),
  ('B+', 'A+', false),
  ('B+', 'A-', false),
  ('B+', 'AB-', false),
  ('B+', 'B-', false),
  ('B+', 'O+', false),
  ('B+', 'O-', false);

-- Donors for B-
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('B-', 'B+', true),
  ('B-', 'B-', true),
  ('B-', 'AB+', true),
  ('B-', 'AB-', true),
  ('B-', 'A+', false),
  ('B-', 'A-', false),
  ('B-', 'O+', false),
  ('B-', 'O-', false);

-- Donors for AB+
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('AB+', 'AB+', true),
  ('AB+', 'A+', false),
  ('AB+', 'A-', false),
  ('AB+', 'B+', false),
  ('AB+', 'B-', false),
  ('AB+', 'AB-', false),
  ('AB+', 'O+', false),
  ('AB+', 'O-', false);

-- Donors for AB-
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('AB-', 'AB+', true),
  ('AB-', 'AB-', true),
  ('AB-', 'A+', false),
  ('AB-', 'A-', false),
  ('AB-', 'B+', false),
  ('AB-', 'B-', false),
  ('AB-', 'O+', false),
  ('AB-', 'O-', false);

-- Donors for O+
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('O+', 'A+', true),
  ('O+', 'B+', true),
  ('O+', 'AB+', true),
  ('O+', 'O+', true),
  ('O+', 'A-', false),
  ('O+', 'B-', false),
  ('O+', 'AB-', false),
  ('O+', 'O-', false);

-- Donors for O-
INSERT INTO blood_compatibility (donor_type, recipient_type, compatible)
VALUES
  ('O-', 'A+', true),
  ('O-', 'A-', true),
  ('O-', 'B+', true),
  ('O-', 'B-', true),
  ('O-', 'AB+', true),
  ('O-', 'AB-', true),
  ('O-', 'O+', true),
  ('O-', 'O-', true);

-- 9. Insert Regional Blood Data
INSERT INTO regional_blood_data (region, population, a_positive, a_negative, b_positive, b_negative, ab_positive, ab_negative, o_positive, o_negative)
VALUES 
  ('Israel', 8323659, 34.0, 4.0, 17.0, 2.0, 7.0, 1.0, 32.0, 3.0),
  ('United States', 331002651, 34.0, 6.0, 10.0, 2.0, 3.5, 0.5, 38.0, 6.0),
  ('United Kingdom', 67886011, 30.0, 8.0, 8.0, 2.0, 2.0, 1.0, 44.0, 5.0),
  ('India', 1380004385, 20.0, 4.0, 30.0, 2.0, 7.0, 1.0, 32.0, 4.0),
  ('Japan', 126476461, 30.0, 5.0, 20.0, 5.0, 5.0, 1.0, 29.0, 5.0);

-- 10. Insert Quiz Questions
INSERT INTO quiz_questions (question, options, correct_answer, explanation, category, difficulty)
VALUES
  (
    'Which blood type is known as the universal donor?',
    '{"A": "AB+", "B": "O-", "C": "O+", "D": "AB-"}',
    'B',
    'O negative blood can be given to anyone regardless of their blood type, making it the universal donor.',
    'Blood Types',
    'Easy'
  ),
  (
    'Which blood type is known as the universal recipient?',
    '{"A": "AB+", "B": "O-", "C": "A+", "D": "B+"}',
    'A',
    'AB positive individuals can receive blood from all blood types, making them universal recipients.',
    'Blood Types',
    'Easy'
  ),
  (
    'How often can a healthy person donate blood?',
    '{"A": "Every week", "B": "Every 2 weeks", "C": "Every 56 days (8 weeks)", "D": "Every 6 months"}',
    'C',
    'Healthy donors can typically donate whole blood every 56 days (8 weeks).',
    'Donation Facts',
    'Medium'
  ),
  (
    'What is the most common blood type in the world?',
    '{"A": "A+", "B": "B+", "C": "AB+", "D": "O+"}',
    'D',
    'O positive is the most common blood type worldwide, found in approximately 38-40% of the population.',
    'Blood Types',
    'Medium'
  ),
  (
    'What is the rarest blood type?',
    '{"A": "O-", "B": "AB-", "C": "B-", "D": "A-"}',
    'B',
    'AB negative is the rarest blood type, found in less than 1% of the population.',
    'Blood Types',
    'Medium'
  ),
  (
    'How long does a typical blood donation take?',
    '{"A": "5-10 minutes", "B": "30-45 minutes", "C": "1-2 hours", "D": "3-4 hours"}',
    'B',
    'The actual blood donation process takes about 8-10 minutes, but the entire process including registration, mini-physical, and refreshments takes about 30-45 minutes.',
    'Donation Facts',
    'Easy'
  ),
  (
    'How much blood is taken during a typical whole blood donation?',
    '{"A": "1 pint (about 470 ml)", "B": "2 pints (about 940 ml)", "C": "3 pints (about 1.4 liters)", "D": "Half a pint (about 235 ml)"}',
    'A',
    'A typical whole blood donation is one pint, which is about 470 ml or 10% of your blood volume.',
    'Donation Facts',
    'Medium'
  ),
  (
    'What determines a person's blood type?',
    '{"A": "The food they eat", "B": "Their genes inherited from parents", "C": "Their age", "D": "Their lifestyle"}',
    'B',
    'Blood type is inherited from parents through genes and doesn't change during a person's lifetime.',
    'Blood Types',
    'Easy'
  ),
  (
    'Can a person with type AB+ blood donate to someone with O- blood?',
    '{"A": "Yes, always", "B": "Yes, but only in emergencies", "C": "No, never", "D": "It depends on the recipient's health"}',
    'C',
    'No, AB+ blood can only be donated to other AB+ individuals. O- recipients can only receive O- blood.',
    'Blood Compatibility',
    'Hard'
  ),
  (
    'What percentage of the eligible population actually donates blood?',
    '{"A": "About 38%", "B": "About 25%", "C": "Less than 10%", "D": "More than 50%"}',
    'C',
    'Less than 10% of eligible donors actually donate blood, despite the constant need.',
    'Donation Facts',
    'Hard'
  ); 