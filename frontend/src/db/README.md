# Database Setup for Blood Donation Management System

This directory contains SQL scripts to set up and populate the database for the Blood Donation Management System.

## Files

- `create_tables.sql` - Creates the basic tables required for the application
- `setup_database.sql` - Comprehensive script that creates all tables, including user_profiles and achievements
- `populate_sample_data.sql` - Populates the database with sample data for testing the leaderboard
- `populate_current_user.sql` - Populates data for your own user account

## Setup Instructions

### Option 1: Using the Supabase Dashboard

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of the scripts in the following order:
   - First run `setup_database.sql` to create all tables
   - Then run `populate_sample_data.sql` to add sample data for the leaderboard
   - Finally, modify and run `populate_current_user.sql` to add data for your own account

### Option 2: Using the Supabase CLI

If you have the Supabase CLI installed, you can run the scripts directly:

```bash
# Navigate to the db directory
cd frontend/src/db

# Run the setup script
supabase db execute --file setup_database.sql

# Run the sample data script
supabase db execute --file populate_sample_data.sql

# Modify populate_current_user.sql with your user ID, then run it
supabase db execute --file populate_current_user.sql
```

### Option 3: Using psql

If you have direct access to the database using psql:

```bash
# Navigate to the db directory
cd frontend/src/db

# Connect to your database
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d YOUR_DB_NAME

# Run the scripts
\i setup_database.sql
\i populate_sample_data.sql
\i populate_current_user.sql
```

## Important Notes

1. **User ID**: Before running `populate_current_user.sql`, replace `'YOUR_USER_ID'` with your actual Supabase user ID. You can find your user ID in the Supabase dashboard under Authentication > Users.

2. **Blood Type and Region**: You can also customize your blood type and region in the `populate_current_user.sql` script.

3. **Row Level Security (RLS)**: All tables have RLS policies that restrict access to a user's own data. This ensures that users can only see and modify their own records.

4. **Trigger Function**: The `update_user_donation_count` trigger function automatically updates the `donation_count` and `last_donation_date` fields in the `user_profiles` table whenever a donation is added or deleted.

5. **Sample Data**: The `populate_sample_data.sql` script creates 50 random users with varying donation counts, plus 5 top donors with high donation counts for the leaderboard.

## Verifying the Setup

After running the scripts, you can verify that everything is set up correctly by:

1. Checking the tables in the Supabase dashboard
2. Running the following query to see the top donors:

```sql
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
```

3. Checking your own user data:

```sql
SELECT * FROM public.user_profiles WHERE id = 'YOUR_USER_ID';
SELECT * FROM public.donations WHERE user_id = 'YOUR_USER_ID';
```

## Troubleshooting

- If you encounter errors about missing tables, make sure you run `setup_database.sql` first.
- If you see permission errors, check that you have the necessary privileges in your Supabase project.
- If the trigger function isn't updating the user profile, check that the trigger is properly created and enabled. 