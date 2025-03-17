-- First, check if the tables exist and drop them if they do
DROP TABLE IF EXISTS blood_compatibility;
DROP TABLE IF EXISTS blood_types;

-- Create the blood_types table
CREATE TABLE blood_types (
  id SERIAL PRIMARY KEY,
  type VARCHAR(3) NOT NULL UNIQUE,
  description TEXT
);

-- Enable Row Level Security but allow all users to read the data
ALTER TABLE blood_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blood types are viewable by everyone" 
  ON blood_types FOR SELECT 
  USING (true);

-- Insert blood types data
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

-- Create the blood_compatibility table
CREATE TABLE blood_compatibility (
  id SERIAL PRIMARY KEY,
  donor_type VARCHAR(3) NOT NULL REFERENCES blood_types(type),
  recipient_type VARCHAR(3) NOT NULL REFERENCES blood_types(type),
  compatible BOOLEAN NOT NULL,
  UNIQUE(donor_type, recipient_type)
);

-- Enable Row Level Security but allow all users to read the data
ALTER TABLE blood_compatibility ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Blood compatibility is viewable by everyone" 
  ON blood_compatibility FOR SELECT 
  USING (true);

-- Insert blood compatibility data

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

-- Add indexes for faster lookups
CREATE INDEX idx_blood_compatibility_donor ON blood_compatibility(donor_type);
CREATE INDEX idx_blood_compatibility_recipient ON blood_compatibility(recipient_type); 