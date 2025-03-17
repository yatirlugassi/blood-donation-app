-- First, check if the table exists and drop it if it does
DROP TABLE IF EXISTS regional_blood_data;

-- Create the regional_blood_data table
CREATE TABLE regional_blood_data (
  id SERIAL PRIMARY KEY,
  region VARCHAR(100) NOT NULL UNIQUE,
  population BIGINT DEFAULT 1000000,
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

-- Enable Row Level Security but allow all users to read the data
ALTER TABLE regional_blood_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Regional blood data is viewable by everyone" 
  ON regional_blood_data FOR SELECT 
  USING (true);

-- Insert data for each region
-- Note: Since the original data only has O, A, B, AB percentages without Rh factor,
-- we'll estimate the positive/negative split based on typical distributions:
-- Approximately 85% Rh+ and 15% Rh- for each blood group

-- Insert statements for each region
INSERT INTO regional_blood_data (
  region, 
  a_positive, a_negative, 
  b_positive, b_negative, 
  ab_positive, ab_negative, 
  o_positive, o_negative
) VALUES
('Australian Aboriginals', 33.15, 5.85, 0.0, 0.0, 0.0, 0.0, 51.85, 9.15),
('Abyssinian', 22.95, 4.05, 21.25, 3.75, 4.25, 0.75, 36.55, 6.45),
('Ainu (Japan)', 27.2, 4.8, 27.2, 4.8, 15.3, 2.7, 14.45, 2.55),
('Albanians', 36.55, 6.45, 11.05, 1.95, 5.1, 0.9, 32.3, 5.7),
('Great Andamanese', 51.0, 9.0, 17.0, 3.0, 10.2, 1.8, 7.65, 1.35),
('Arab', 26.35, 4.65, 24.65, 4.35, 5.1, 0.9, 28.9, 5.1),
('Armenians', 42.5, 7.5, 11.05, 1.95, 5.1, 0.9, 26.35, 4.65),
('Asian American', 23.8, 4.2, 22.95, 4.05, 4.25, 0.75, 34.0, 6.0),
('Austrian', 37.4, 6.6, 11.05, 1.95, 5.1, 0.9, 30.6, 5.4),
('Banta', 25.5, 4.5, 16.15, 2.85, 4.25, 0.75, 39.1, 6.9),
('Basques', 37.4, 6.6, 3.4, 0.6, 0.85, 0.15, 43.35, 7.65),
('Belgian', 35.7, 6.3, 6.8, 1.2, 2.55, 0.45, 39.95, 7.05),
('Bororo (Brazil)', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 85.0, 15.0),
('Brazilian', 34.85, 6.15, 7.65, 1.35, 2.55, 0.45, 39.95, 7.05),
('Bulgarian', 37.4, 6.6, 12.75, 2.25, 6.8, 1.2, 27.2, 4.8),
('Bamar people', 20.4, 3.6, 28.05, 4.95, 5.95, 1.05, 30.6, 5.4),
('Buryats (Siberia)', 17.85, 3.15, 32.3, 5.7, 6.8, 1.2, 28.05, 4.95),
('Bushmen', 28.9, 5.1, 7.65, 1.35, 1.7, 0.3, 47.6, 8.4),
('Chinese - Canton', 19.55, 3.45, 21.25, 3.75, 3.4, 0.6, 39.95, 7.05),
('Chinese - Ningbo', 27.2, 4.8, 21.25, 3.75, 7.65, 1.35, 29.75, 5.25),
('Chinese - Yangchow', 27.2, 4.8, 22.95, 4.05, 5.95, 1.05, 26.35, 4.65),
('Chinese - Peking', 22.95, 4.05, 27.2, 4.8, 11.05, 1.95, 24.65, 4.35),
('Chuvash', 24.65, 4.35, 28.05, 4.95, 5.95, 1.05, 25.5, 4.5),
('Croat', 35.7, 6.3, 14.45, 2.55, 5.95, 1.05, 28.9, 5.1),
('Czech', 37.4, 6.6, 15.3, 2.7, 7.65, 1.35, 25.5, 4.5),
('Danish', 37.4, 6.6, 9.35, 1.65, 3.4, 0.6, 34.85, 6.15),
('Dutch', 36.55, 6.45, 7.65, 1.35, 2.55, 0.45, 38.25, 6.75),
('Egyptian', 30.6, 5.4, 20.4, 3.6, 6.8, 1.2, 28.05, 4.95),
('Eskimo (Alaska)', 37.4, 6.6, 11.05, 1.95, 4.25, 0.75, 32.3, 5.7),
('Eskimo (Greenland)', 30.6, 5.4, 19.55, 3.45, 4.25, 0.75, 48.45, 8.55),
('Estonians', 30.6, 5.4, 19.55, 3.45, 6.8, 1.2, 28.9, 5.1),
('Fijian', 28.9, 5.1, 14.45, 2.55, 5.1, 0.9, 37.4, 6.6),
('Finns', 34.85, 6.15, 15.3, 2.7, 5.95, 1.05, 28.9, 5.1),
('French', 39.95, 7.05, 5.95, 1.05, 2.55, 0.45, 36.55, 6.45),
('Georgian', 31.45, 5.55, 10.2, 1.8, 3.4, 0.6, 39.1, 6.9),
('German', 36.55, 6.45, 9.35, 1.65, 4.25, 0.75, 34.85, 6.15),
('Greek', 32.3, 5.7, 11.9, 2.1, 4.25, 0.75, 37.4, 6.6),
('Gypsies (Hungary)', 22.95, 4.05, 29.75, 5.25, 8.5, 1.5, 24.65, 4.35),
('Hawaiian', 51.85, 9.15, 1.7, 0.3, 0.85, 0.15, 31.45, 5.55),
('Hindu (Bombay)', 24.65, 4.35, 23.8, 4.2, 9.35, 1.65, 27.2, 4.8),
('Hungarian', 36.55, 6.45, 16.15, 2.85, 6.8, 1.2, 30.6, 5.4),
('Icelander', 27.2, 4.8, 8.5, 1.5, 2.55, 0.45, 47.6, 8.4),
('Indian (India)', 18.7, 3.3, 28.05, 4.95, 5.95, 1.05, 31.45, 5.55),
('Indian (US)', 13.6, 2.4, 3.4, 0.6, 0.85, 0.15, 67.15, 11.85),
('Irish', 29.75, 5.25, 8.5, 1.5, 0.85, 0.15, 44.2, 7.8),
('Italian (Milan)', 34.85, 6.15, 9.35, 1.65, 2.55, 0.45, 39.1, 6.9),
('Japanese', 32.3, 5.7, 18.7, 3.3, 8.5, 1.5, 25.5, 4.5),
('Jew (Germany)', 34.85, 6.15, 10.2, 1.8, 4.25, 0.75, 35.7, 6.3),
('Jew (Polish)', 34.85, 6.15, 15.3, 2.7, 6.8, 1.2, 28.05, 4.95),
('Kalmuck', 19.55, 3.45, 34.85, 6.15, 9.35, 1.65, 22.1, 3.9),
('Kikuyu (Kenya)', 16.15, 2.85, 17.0, 3.0, 0.85, 0.15, 51.0, 9.0),
('Korean', 27.2, 4.8, 26.35, 4.65, 7.65, 1.35, 23.8, 4.2),
('Lapp (Norway)', 53.55, 9.45, 3.4, 0.6, 3.4, 0.6, 24.65, 4.35),
('Latvian', 31.45, 5.55, 20.4, 3.6, 5.95, 1.05, 27.2, 4.8),
('Lithuanian', 28.9, 5.1, 17.0, 3.0, 5.1, 0.9, 34.0, 6.0),
('Malay', 15.3, 2.7, 17.0, 3.0, 0.0, 0.0, 52.7, 9.3),
('Maori', 45.9, 8.1, 0.85, 0.15, 0.0, 0.0, 39.1, 6.9),
('Maya', 0.85, 0.15, 0.85, 0.15, 0.85, 0.15, 83.3, 14.7),
('Moro', 13.6, 2.4, 17.0, 3.0, 0.0, 0.0, 54.4, 9.6),
('Navajo Indians', 22.95, 4.05, 0.0, 0.0, 0.0, 0.0, 62.05, 10.95),
('Nicobarese', 7.65, 1.35, 12.75, 2.25, 0.85, 0.15, 62.9, 11.1),
('Norwegian', 42.5, 7.5, 6.8, 1.2, 3.4, 0.6, 33.15, 5.85),
('Papuan (New Guinea)', 22.95, 4.05, 19.55, 3.45, 7.65, 1.35, 34.85, 6.15),
('Persian', 28.05, 4.95, 18.7, 3.3, 5.95, 1.05, 32.3, 5.7),
('Peruvian Indians', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 85.0, 15.0),
('Philippine', 18.7, 3.3, 22.95, 4.05, 5.1, 0.9, 38.25, 6.75),
('Polish', 33.15, 5.85, 17.0, 3.0, 7.65, 1.35, 28.05, 4.95),
('Portuguese', 45.05, 7.95, 6.8, 1.2, 3.4, 0.6, 29.75, 5.25),
('Romanian', 36.55, 6.45, 13.6, 2.4, 6.8, 1.2, 28.05, 4.95),
('Russian', 30.6, 5.4, 19.55, 3.45, 6.8, 1.2, 28.05, 4.95),
('Sardinian', 22.1, 3.9, 16.15, 2.85, 4.25, 0.75, 42.5, 7.5),
('Scot', 28.9, 5.1, 10.2, 1.8, 2.55, 0.45, 43.35, 7.65),
('Serb', 35.7, 6.3, 13.6, 2.4, 4.25, 0.75, 32.3, 5.7),
('Shompen Nicobarese', 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 85.0, 15.0),
('Slovakian', 35.7, 6.3, 13.6, 2.4, 4.25, 0.75, 31.45, 5.55),
('South African', 34.0, 6.0, 9.35, 1.65, 3.4, 0.6, 38.25, 6.75),
('Spanish', 39.95, 7.05, 8.5, 1.5, 4.25, 0.75, 32.3, 5.7),
('Sudanic', 13.6, 2.4, 17.85, 3.15, 0.0, 0.0, 52.7, 9.3),
('Swedish', 38.25, 6.75, 10.2, 1.8, 5.95, 1.05, 30.6, 5.4),
('Swiss', 42.5, 7.5, 7.65, 1.35, 2.55, 0.45, 32.3, 5.7),
('Tatar', 25.5, 4.5, 24.65, 4.35, 11.05, 1.95, 23.8, 4.2),
('Thai', 17.85, 3.15, 30.6, 5.4, 7.65, 1.35, 27.2, 4.8),
('Turkish', 28.05, 4.95, 16.15, 2.85, 5.1, 0.9, 36.55, 6.45),
('Ukrainian', 34.0, 6.0, 15.3, 2.7, 5.1, 0.9, 31.45, 5.55),
('White American', 34.0, 6.0, 9.35, 1.65, 3.4, 0.6, 38.25, 6.75),
('Vietnamese', 18.7, 3.3, 25.5, 4.5, 4.25, 0.75, 35.7, 6.3),
('African American', 22.95, 4.05, 17.0, 3.0, 3.4, 0.6, 41.65, 7.35);

-- Add an index on the region column for faster lookups
CREATE INDEX idx_regional_blood_data_region ON regional_blood_data(region); 