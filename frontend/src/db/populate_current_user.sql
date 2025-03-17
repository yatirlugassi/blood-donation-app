-- Populate data for the current logged-in user
-- Replace 'YOUR_USER_ID' with your actual Supabase user ID

-- First, ensure the user profile exists
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
    'YOUR_USER_ID',  -- Replace with your actual user ID
    'O+',            -- Replace with your blood type
    'New York',      -- Replace with your region
    0,               -- Will be updated by trigger
    NULL,            -- Will be updated by trigger
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE
SET 
    blood_type = EXCLUDED.blood_type,
    region = EXCLUDED.region,
    updated_at = NOW();

-- Add sample donations for the current user
INSERT INTO public.donations (
    user_id,
    donation_date,
    donation_center,
    blood_amount_ml,
    donation_type,
    notes
)
VALUES
    ('YOUR_USER_ID', CURRENT_DATE - 180, 'Red Cross Blood Center', 450, 'Whole Blood', 'First donation'),
    ('YOUR_USER_ID', CURRENT_DATE - 120, 'Community Blood Center', 500, 'Plasma', 'Felt great afterward'),
    ('YOUR_USER_ID', CURRENT_DATE - 60, 'University Hospital', 450, 'Whole Blood', 'Quick and easy process'),
    ('YOUR_USER_ID', CURRENT_DATE - 10, 'Memorial Blood Bank', 475, 'Platelets', 'Took longer than expected but worth it');

-- Add a donation goal for the current user
INSERT INTO public.donation_goals (
    user_id,
    target_count,
    target_date,
    title,
    description,
    is_completed
)
VALUES
    ('YOUR_USER_ID', 10, CURRENT_DATE + 365, 'Reach 10 donations', 'My goal is to reach 10 total donations by the end of the year', FALSE),
    ('YOUR_USER_ID', 5, CURRENT_DATE + 180, 'Five donations in six months', 'Challenge myself to donate regularly', FALSE);

-- Add achievements for the current user
INSERT INTO public.user_achievements (user_id, achievement_id)
VALUES 
    ('YOUR_USER_ID', 1),  -- First Time Donor
    ('YOUR_USER_ID', 2);  -- Regular Donor

-- Add a reminder for the current user
INSERT INTO public.donation_reminders (
    user_id,
    reminder_date,
    title,
    message,
    is_read
)
VALUES
    ('YOUR_USER_ID', CURRENT_DATE + 50, 'Time to donate again', 'You are eligible to donate blood again. Schedule your appointment!', FALSE),
    ('YOUR_USER_ID', CURRENT_DATE + 80, 'Donation drive at University', 'There is a special blood donation drive at the University Hospital. Your blood type is needed!', FALSE);

-- Show the current user's data
SELECT 'Your profile has been created with the following data:' as message;

SELECT 
    p.blood_type,
    p.region,
    p.donation_count,
    p.last_donation_date
FROM 
    public.user_profiles p
WHERE 
    p.id = 'YOUR_USER_ID';

SELECT 
    COUNT(*) as donation_count,
    MIN(donation_date) as first_donation,
    MAX(donation_date) as last_donation
FROM 
    public.donations
WHERE 
    user_id = 'YOUR_USER_ID';

SELECT 
    g.title,
    g.target_count,
    g.target_date,
    g.is_completed
FROM 
    public.donation_goals g
WHERE 
    g.user_id = 'YOUR_USER_ID';

SELECT 
    a.name as achievement_name,
    a.description,
    ua.earned_at
FROM 
    public.user_achievements ua
JOIN 
    public.achievements a ON ua.achievement_id = a.id
WHERE 
    ua.user_id = 'YOUR_USER_ID';

SELECT 
    r.title as reminder_title,
    r.reminder_date,
    r.message,
    r.is_read
FROM 
    public.donation_reminders r
WHERE 
    r.user_id = 'YOUR_USER_ID'; 