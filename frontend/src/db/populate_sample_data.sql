-- Populate sample data for Blood Donation Management System
-- This script creates sample users and data for testing the application

-- First, ensure we have the necessary tables
\i setup_database.sql

-- Create sample users for the leaderboard
-- In a real application, you would create users through the auth API
-- For this example, we'll create sample data with mock UUIDs

-- Function to generate random UUIDs (for demonstration purposes)
CREATE OR REPLACE FUNCTION generate_mock_uuid()
RETURNS UUID AS $$
BEGIN
    RETURN md5(random()::text || clock_timestamp()::text)::uuid;
END;
$$ LANGUAGE plpgsql;

-- Create sample data for multiple users
DO $$
DECLARE
    user_uuid UUID;
    blood_types TEXT[] := ARRAY['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    regions TEXT[] := ARRAY['New York', 'California', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'];
    i INTEGER;
    selected_blood_type TEXT;
    selected_region TEXT;
BEGIN
    -- Create 50 sample users with varying donation counts
    FOR i IN 1..50 LOOP
        user_uuid := generate_mock_uuid();
        selected_blood_type := blood_types[1 + floor(random() * array_length(blood_types, 1))::INTEGER];
        selected_region := regions[1 + floor(random() * array_length(regions, 1))::INTEGER];
        
        -- Insert directly into user_profiles (bypassing auth for this demo)
        INSERT INTO public.user_profiles (
            id, 
            blood_type, 
            region, 
            donation_count, 
            last_donation_date,
            created_at,
            updated_at
        )
        VALUES (
            user_uuid,
            selected_blood_type,
            selected_region,
            floor(random() * 30)::INTEGER + 1,  -- Random donation count between 1 and 30
            CURRENT_DATE - (random() * 90)::INTEGER,  -- Random date within last 90 days
            NOW() - (random() * 365 * 2)::INTEGER * INTERVAL '1 day',  -- Random creation date within last 2 years
            NOW()
        );
        
        -- Create sample donations for this user
        FOR j IN 1..floor(random() * 10)::INTEGER + 1 LOOP  -- Random number of donations between 1 and 10
            INSERT INTO public.donations (
                user_id,
                donation_date,
                donation_center,
                blood_amount_ml,
                donation_type,
                notes
            )
            VALUES (
                user_uuid,
                CURRENT_DATE - (random() * 365)::INTEGER,  -- Random date within last year
                CASE floor(random() * 5)::INTEGER
                    WHEN 0 THEN 'Red Cross Blood Center'
                    WHEN 1 THEN 'Community Blood Center'
                    WHEN 2 THEN 'University Hospital'
                    WHEN 3 THEN 'Memorial Blood Bank'
                    ELSE 'Regional Medical Center'
                END,
                450 + (random() * 100)::INTEGER,  -- Random amount between 450-550ml
                CASE floor(random() * 4)::INTEGER
                    WHEN 0 THEN 'Whole Blood'
                    WHEN 1 THEN 'Plasma'
                    WHEN 2 THEN 'Platelets'
                    ELSE 'Double Red Cells'
                END,
                CASE WHEN random() > 0.5 THEN 'Felt good after donation' ELSE 'Quick and easy process' END
            );
        END LOOP;
        
        -- Create a donation goal for this user
        INSERT INTO public.donation_goals (
            user_id,
            target_count,
            target_date,
            title,
            description,
            is_completed
        )
        VALUES (
            user_uuid,
            floor(random() * 10)::INTEGER + 5,  -- Random target between 5 and 15
            CURRENT_DATE + (random() * 180)::INTEGER,  -- Random date within next 6 months
            'Reach donation milestone',
            'My personal goal for blood donations',
            random() > 0.7  -- 30% chance of being completed
        );
        
        -- Add some achievements for this user
        IF random() > 0.3 THEN  -- 70% chance of having achievements
            INSERT INTO public.user_achievements (user_id, achievement_id)
            VALUES (user_uuid, 1);  -- First Time Donor
            
            IF random() > 0.5 THEN  -- 50% chance of having more achievements
                INSERT INTO public.user_achievements (user_id, achievement_id)
                VALUES (user_uuid, 2);  -- Regular Donor
                
                IF random() > 0.7 THEN  -- 30% chance of having even more achievements
                    INSERT INTO public.user_achievements (user_id, achievement_id)
                    VALUES (user_uuid, 6);  -- Lifesaver
                END IF;
            END IF;
        END IF;
        
        -- Add a reminder for this user
        IF random() > 0.5 THEN  -- 50% chance of having a reminder
            INSERT INTO public.donation_reminders (
                user_id,
                reminder_date,
                title,
                message,
                is_read
            )
            VALUES (
                user_uuid,
                CURRENT_DATE + (random() * 60)::INTEGER,  -- Random date within next 2 months
                'Time to donate again',
                'You are eligible to donate blood again. Schedule your appointment!',
                random() > 0.7  -- 30% chance of being read
            );
        END IF;
    END LOOP;
END $$;

-- Create a few top donors with high donation counts for the leaderboard
DO $$
DECLARE
    user_uuid UUID;
    blood_types TEXT[] := ARRAY['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    regions TEXT[] := ARRAY['New York', 'California', 'Texas', 'Florida', 'Illinois'];
    donation_count INTEGER;
    i INTEGER;
BEGIN
    -- Create 5 top donors
    FOR i IN 1..5 LOOP
        user_uuid := generate_mock_uuid();
        donation_count := 30 + i * 5;  -- 35, 40, 45, 50, 55
        
        -- Insert directly into user_profiles
        INSERT INTO public.user_profiles (
            id, 
            blood_type, 
            region, 
            donation_count, 
            last_donation_date,
            created_at,
            updated_at
        )
        VALUES (
            user_uuid,
            blood_types[1 + floor(random() * array_length(blood_types, 1))::INTEGER],
            regions[i],  -- Each top donor from a different region
            donation_count,
            CURRENT_DATE - (random() * 30)::INTEGER,  -- Recent donation
            NOW() - (365 * 3)::INTEGER * INTERVAL '1 day',  -- Created 3 years ago
            NOW()
        );
        
        -- Create sample donations for this top donor
        FOR j IN 1..donation_count LOOP
            INSERT INTO public.donations (
                user_id,
                donation_date,
                donation_center,
                blood_amount_ml,
                donation_type,
                notes
            )
            VALUES (
                user_uuid,
                CURRENT_DATE - (j * 56)::INTEGER,  -- Regular donations every 56 days
                CASE floor(random() * 5)::INTEGER
                    WHEN 0 THEN 'Red Cross Blood Center'
                    WHEN 1 THEN 'Community Blood Center'
                    WHEN 2 THEN 'University Hospital'
                    WHEN 3 THEN 'Memorial Blood Bank'
                    ELSE 'Regional Medical Center'
                END,
                450 + (random() * 100)::INTEGER,
                'Whole Blood',
                'Regular donor'
            );
        END LOOP;
        
        -- Add achievements for top donors
        INSERT INTO public.user_achievements (user_id, achievement_id)
        VALUES 
            (user_uuid, 1),  -- First Time Donor
            (user_uuid, 2),  -- Regular Donor
            (user_uuid, 3),  -- Silver Donor
            (user_uuid, 6),  -- Lifesaver
            (user_uuid, 7);  -- Blood Hero
        
        -- Add Gold Donor achievement for those with 25+ donations
        IF donation_count >= 25 THEN
            INSERT INTO public.user_achievements (user_id, achievement_id)
            VALUES (user_uuid, 4);  -- Gold Donor
        END IF;
        
        -- Add Platinum Donor achievement for those with 50+ donations
        IF donation_count >= 50 THEN
            INSERT INTO public.user_achievements (user_id, achievement_id)
            VALUES (user_uuid, 5);  -- Platinum Donor
        END IF;
    END LOOP;
END $$;

-- Drop the temporary function
DROP FUNCTION IF EXISTS generate_mock_uuid();

-- Output summary of created data
SELECT 'User Profiles' as table_name, COUNT(*) as record_count FROM public.user_profiles
UNION ALL
SELECT 'Donations', COUNT(*) FROM public.donations
UNION ALL
SELECT 'Donation Goals', COUNT(*) FROM public.donation_goals
UNION ALL
SELECT 'User Achievements', COUNT(*) FROM public.user_achievements
UNION ALL
SELECT 'Donation Reminders', COUNT(*) FROM public.donation_reminders;

-- Show top 10 donors for the leaderboard
SELECT 
    id as user_id,
    blood_type,
    region,
    donation_count,
    last_donation_date
FROM 
    public.user_profiles
ORDER BY 
    donation_count DESC
LIMIT 10; 