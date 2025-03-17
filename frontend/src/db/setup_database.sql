-- Setup script for Blood Donation Management System
-- This script creates all necessary tables and populates them with sample data

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    blood_type VARCHAR(10),
    region VARCHAR(100),
    donation_count INTEGER DEFAULT 0,
    last_donation_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for user_profiles table
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.user_profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.user_profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Create achievements table
CREATE TABLE IF NOT EXISTS public.achievements (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    icon_name VARCHAR(50),
    requirement_type VARCHAR(50) NOT NULL,
    requirement_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    donation_date DATE NOT NULL,
    donation_center VARCHAR(255) NOT NULL,
    blood_amount_ml INTEGER NOT NULL,
    donation_type VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for donations table
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own donations
CREATE POLICY "Users can view their own donations" 
ON public.donations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own donations
CREATE POLICY "Users can insert their own donations" 
ON public.donations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own donations
CREATE POLICY "Users can update their own donations" 
ON public.donations 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own donations
CREATE POLICY "Users can delete their own donations" 
ON public.donations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create donation_goals table
CREATE TABLE IF NOT EXISTS public.donation_goals (
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

-- Add RLS policies for donation_goals table
ALTER TABLE public.donation_goals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own goals
CREATE POLICY "Users can view their own goals" 
ON public.donation_goals 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own goals
CREATE POLICY "Users can insert their own goals" 
ON public.donation_goals 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own goals
CREATE POLICY "Users can update their own goals" 
ON public.donation_goals 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own goals
CREATE POLICY "Users can delete their own goals" 
ON public.donation_goals 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    achievement_id INTEGER NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for user_achievements table
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create donation_reminders table
CREATE TABLE IF NOT EXISTS public.donation_reminders (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    reminder_date DATE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for donation_reminders table
ALTER TABLE public.donation_reminders ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own reminders
CREATE POLICY "Users can view their own reminders" 
ON public.donation_reminders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to update their own reminders
CREATE POLICY "Users can update their own reminders" 
ON public.donation_reminders 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger to update user profile donation count when a new donation is added
CREATE OR REPLACE FUNCTION public.update_user_donation_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the donation count in user_profiles
    UPDATE public.user_profiles
    SET 
        donation_count = (
            SELECT COUNT(*) 
            FROM public.donations 
            WHERE user_id = NEW.user_id
        ),
        last_donation_date = NEW.donation_date,
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on donations table
CREATE TRIGGER update_user_donation_count_trigger
AFTER INSERT OR DELETE ON public.donations
FOR EACH ROW
EXECUTE FUNCTION public.update_user_donation_count();

-- Insert sample achievements
INSERT INTO public.achievements (name, description, icon_name, requirement_type, requirement_count)
VALUES
    ('First Time Donor', 'Completed your first blood donation', 'trophy', 'donation_count', 1),
    ('Regular Donor', 'Completed 5 blood donations', 'medal', 'donation_count', 5),
    ('Silver Donor', 'Completed 10 blood donations', 'star', 'donation_count', 10),
    ('Gold Donor', 'Completed 25 blood donations', 'crown', 'donation_count', 25),
    ('Platinum Donor', 'Completed 50 blood donations', 'diamond', 'donation_count', 50),
    ('Lifesaver', 'Potentially saved up to 15 lives through donations', 'heart', 'lives_saved', 15),
    ('Blood Hero', 'Potentially saved up to 30 lives through donations', 'shield', 'lives_saved', 30),
    ('Donation Streak', 'Donated blood consistently for a year', 'fire', 'streak_days', 365),
    ('Type O Hero', 'As a universal donor, you\'ve donated 5 times', 'universal', 'type_o_count', 5),
    ('Community Champion', 'Referred 3 friends who became donors', 'users', 'referral_count', 3);

-- Sample data will be inserted when users are created
-- The following are examples of how to insert data for a specific user

-- Example of how to insert a user profile (replace UUID with actual user ID)
-- INSERT INTO public.user_profiles (id, blood_type, region, donation_count, last_donation_date)
-- VALUES 
--    ('00000000-0000-0000-0000-000000000000', 'O+', 'New York', 5, '2023-05-15');

-- Example of how to insert donations (replace UUID with actual user ID)
-- INSERT INTO public.donations (user_id, donation_date, donation_center, blood_amount_ml, donation_type, notes)
-- VALUES
--    ('00000000-0000-0000-0000-000000000000', '2023-05-15', 'Central Blood Bank', 450, 'Whole Blood', 'Felt good after donation'),
--    ('00000000-0000-0000-0000-000000000000', '2023-02-10', 'Red Cross Center', 450, 'Whole Blood', 'Quick and easy process');

-- Example of how to insert donation goals (replace UUID with actual user ID)
-- INSERT INTO public.donation_goals (user_id, target_count, target_date, title, description, is_completed)
-- VALUES
--    ('00000000-0000-0000-0000-000000000000', 10, '2023-12-31', 'Reach 10 donations', 'My goal is to reach 10 total donations by the end of the year', false);

-- Example of how to insert user achievements (replace UUID with actual user ID)
-- INSERT INTO public.user_achievements (user_id, achievement_id)
-- VALUES
--    ('00000000-0000-0000-0000-000000000000', 1),  -- First Time Donor
--    ('00000000-0000-0000-0000-000000000000', 2);  -- Regular Donor

-- Example of how to insert donation reminders (replace UUID with actual user ID)
-- INSERT INTO public.donation_reminders (user_id, reminder_date, title, message, is_read)
-- VALUES
--    ('00000000-0000-0000-0000-000000000000', '2023-08-15', 'Time to donate again', 'You are eligible to donate blood again. Schedule your appointment!', false);

-- Function to create sample data for a user
CREATE OR REPLACE FUNCTION create_sample_data_for_user(user_uuid UUID, user_blood_type VARCHAR, user_region VARCHAR)
RETURNS VOID AS $$
DECLARE
    donation_count INTEGER := floor(random() * 15)::INTEGER + 1;  -- Random number between 1 and 15
    last_donation_date DATE;
    i INTEGER;
    donation_centers TEXT[] := ARRAY['Red Cross Blood Center', 'Community Blood Center', 'University Hospital', 'Memorial Blood Bank', 'Regional Medical Center'];
    donation_types TEXT[] := ARRAY['Whole Blood', 'Plasma', 'Platelets', 'Double Red Cells'];
    achievement_ids INTEGER[];
    reminder_date DATE;
BEGIN
    -- Create user profile
    INSERT INTO public.user_profiles (id, blood_type, region, donation_count, last_donation_date)
    VALUES (user_uuid, user_blood_type, user_region, donation_count, NULL);
    
    -- Add donations
    FOR i IN 1..donation_count LOOP
        last_donation_date := CURRENT_DATE - (random() * 365 * 2)::INTEGER;  -- Random date within last 2 years
        
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
            last_donation_date, 
            donation_centers[1 + floor(random() * array_length(donation_centers, 1))::INTEGER],
            450 + (random() * 100)::INTEGER,  -- Random amount between 450-550ml
            donation_types[1 + floor(random() * array_length(donation_types, 1))::INTEGER],
            CASE WHEN random() > 0.5 THEN 'Felt good after donation' ELSE 'Quick and easy process' END
        );
    END LOOP;
    
    -- Update last donation date in profile
    UPDATE public.user_profiles
    SET last_donation_date = (
        SELECT MAX(donation_date) FROM public.donations WHERE user_id = user_uuid
    )
    WHERE id = user_uuid;
    
    -- Add donation goals
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
        donation_count + 5, 
        CURRENT_DATE + 180, 
        'Reach ' || (donation_count + 5)::TEXT || ' donations', 
        'My goal is to reach ' || (donation_count + 5)::TEXT || ' total donations within 6 months',
        FALSE
    );
    
    -- Add achievements based on donation count
    IF donation_count >= 1 THEN
        achievement_ids := ARRAY[1];  -- First Time Donor
    END IF;
    
    IF donation_count >= 5 THEN
        achievement_ids := array_append(achievement_ids, 2);  -- Regular Donor
    END IF;
    
    IF donation_count >= 10 THEN
        achievement_ids := array_append(achievement_ids, 3);  -- Silver Donor
    END IF;
    
    IF donation_count >= 25 THEN
        achievement_ids := array_append(achievement_ids, 4);  -- Gold Donor
    END IF;
    
    IF donation_count >= 50 THEN
        achievement_ids := array_append(achievement_ids, 5);  -- Platinum Donor
    END IF;
    
    -- Insert achievements
    IF achievement_ids IS NOT NULL THEN
        FOR i IN 1..array_length(achievement_ids, 1) LOOP
            INSERT INTO public.user_achievements (user_id, achievement_id)
            VALUES (user_uuid, achievement_ids[i]);
        END LOOP;
    END IF;
    
    -- Add donation reminder
    reminder_date := CURRENT_DATE + (56 + (random() * 30)::INTEGER);  -- Random date ~2-3 months in future
    
    INSERT INTO public.donation_reminders (
        user_id, 
        reminder_date, 
        title, 
        message, 
        is_read
    )
    VALUES (
        user_uuid, 
        reminder_date, 
        'Time to donate again', 
        'You are eligible to donate blood again. Schedule your appointment!', 
        FALSE
    );
END;
$$ LANGUAGE plpgsql;

-- Create sample users and data
-- Note: In a real application, you would create users through the auth API
-- and then call the create_sample_data_for_user function for each user
-- For this example, we'll create sample data for existing users

-- Example of how to create sample data for a specific user (replace with actual user ID)
-- SELECT create_sample_data_for_user('00000000-0000-0000-0000-000000000000', 'O+', 'New York');

-- Drop the function when done
-- DROP FUNCTION IF EXISTS create_sample_data_for_user; 