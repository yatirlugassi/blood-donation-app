# Blood Donation Management System - Frontend

## Recent Updates

### Fixed Login and Dashboard Navigation

We've fixed the login functionality and dashboard navigation:

1. **Dashboard Route**: Added the Dashboard route to the application
2. **Protected Routes**: Implemented a ProtectedRoute component to ensure only authenticated users can access the dashboard
3. **Improved Navigation**: Enhanced the login process to ensure proper redirection to the dashboard
4. **Loading States**: Added visual feedback during authentication checks

### Database Connection Fixes

We've identified and fixed an issue with the Supabase database connection. The application now uses hardcoded credentials in the `supabaseClient.ts` file to ensure a stable connection.

## Testing the Connection

1. Start the development server:
   ```
   npm start
   ```

2. Navigate to one of the diagnostic pages:
   - Simple test (recommended): `http://localhost:3000/simple-test`
   - Basic test login: `http://localhost:3000/test-login`
   - Advanced diagnostics: `http://localhost:3000/diagnostics`

3. On the simple test page:
   - Click "Test Connection" to perform a direct test with a fresh Supabase client
   - This test is isolated from the rest of the application and has a 5-second timeout

4. Alternatively, run the direct test script from the command line:
   ```
   cd frontend
   node src/directTest.js
   ```
   This script tests the connection without any React dependencies.

## Using the Application

1. **Login**: Navigate to `/login` and enter your credentials
2. **Dashboard**: After successful login, you'll be redirected to `/dashboard`
3. **Protected Routes**: Attempting to access the dashboard without authentication will redirect to the login page

## What Was Fixed

1. **Hardcoded Credentials**: We've temporarily hardcoded the Supabase URL and anon key in `supabaseClient.ts` to bypass environment variable loading issues.

2. **Enhanced Error Handling**: We've added detailed error logging throughout the authentication process to help identify issues.

3. **Connection Testing**: We've implemented immediate connection testing when the Supabase client initializes.

4. **Request Timeouts**: We've added custom timeout handling to prevent requests from hanging indefinitely.

5. **Diagnostic Tools**: We've created dedicated diagnostic pages to help troubleshoot connection issues.

6. **Simplified Testing**: We've added a simple test component and direct test script that are isolated from the rest of the application.

7. **Protected Routes**: We've implemented a ProtectedRoute component to secure the dashboard.

8. **Improved Navigation**: We've enhanced the login process to ensure proper redirection to the dashboard.

## Common Issues and Solutions

1. **Connection Timeout**: If you see "Connection timeout" errors, it could indicate:
   - Network connectivity issues
   - Supabase service being temporarily unavailable
   - Firewall or proxy blocking the connection

2. **Authentication Errors**: If you can connect to Supabase but can't log in:
   - Verify your email and password
   - Check if your account exists in Supabase
   - Look for specific error messages in the browser console

3. **Browser Storage Issues**: If localStorage tests fail:
   - Check if your browser has privacy settings that block storage
   - Try using a different browser
   - Clear browser cache and cookies

4. **React App Hanging**: If the React app hangs:
   - Try the direct test script to isolate React from the equation
   - Check for browser extensions that might be interfering
   - Try a different browser

5. **Navigation Issues**: If navigation to the dashboard fails:
   - Check the browser console for errors
   - Verify that you're properly authenticated
   - Try clearing browser cache and cookies

## Long-term Solutions

For a more secure implementation, consider these steps once the application is working:

1. **Environment Variables**: Move the credentials back to environment variables:
   - Ensure your `.env` file is in the root of the frontend directory
   - All environment variables should be prefixed with `REACT_APP_`
   - Example:
     ```
     REACT_APP_SUPABASE_URL=your_supabase_url
     REACT_APP_SUPABASE_ANON_KEY=your_anon_key
     ```

2. **Restart After Changes**: Always restart the development server after changing environment variables.

3. **Use .env.local**: For local development, consider using a `.env.local` file which is not committed to version control.

## Running the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm start
   ```

3. The application will be available at `http://localhost:3000`

## Available Routes

- `/`: Home page
- `/login`: Standard login page
- `/dashboard`: User dashboard (requires authentication)
- `/test-login`: Test login page with connection testing
- `/simple-test`: Simple isolated connection test
- `/diagnostics`: Advanced connection diagnostics
- `/register`: Registration page
- `/compatibility`: Blood compatibility checker
- `/regional-data`: Regional blood distribution data
- `/resources/faq`: FAQ page
- `/resources/donation-centers`: Donation centers information
- `/resources/guidelines`: Donation guidelines
- `/resources/research`: Research and statistics

## New Features

### Donation Management
The application now includes a comprehensive donation management system that allows users to:
- Record new blood donations with details like date, location, and type
- Set donation goals and track progress
- View donation history and statistics
- Receive reminders for upcoming eligible donation dates

To set up the donation functionality, you need to run the SQL scripts in the `src/db` directory. See the [Database Setup](#database-setup) section below for detailed instructions.

### Community Features
The application now includes community features that allow users to:
- Share their donation achievements on social media
- Generate shareable cards with their donation statistics
- View a leaderboard of top donors globally and in their region
- Track their ranking among other donors

These features help create a sense of community and encourage more donations through friendly competition and social sharing.

## Database Setup

We've created comprehensive SQL scripts to set up and populate the database for the application. These scripts are located in the `src/db` directory:

1. **setup_database.sql**: Creates all necessary tables, including:
   - `user_profiles`: Stores user information like blood type, region, and donation count
   - `donations`: Records individual donation details
   - `donation_goals`: Tracks user-defined donation goals
   - `achievements`: Defines available achievements
   - `user_achievements`: Links users to their earned achievements
   - `donation_reminders`: Manages donation reminders

2. **populate_sample_data.sql**: Populates the database with sample data for testing:
   - Creates 50 random users with varying donation counts
   - Adds 5 top donors with high donation counts for the leaderboard
   - Generates realistic donation histories, goals, and achievements

3. **populate_current_user.sql**: Adds sample data for your own user account:
   - Creates a profile with your blood type and region
   - Adds sample donations, goals, and achievements
   - Generates reminders for future donations

### Running the Database Scripts

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the scripts in the following order:
   - First run `setup_database.sql` to create all tables
   - Then run `populate_sample_data.sql` to add sample data for the leaderboard
   - Finally, modify `populate_current_user.sql` with your user ID and run it

For detailed instructions, see the README file in the `src/db` directory.

### Verifying the Setup

After running the scripts, you can verify that everything is set up correctly by:

1. Logging into the application
2. Navigating to the Dashboard
3. Checking the "Community" tab to see the leaderboard
4. Viewing your donation history and achievements

If you encounter any issues, check the troubleshooting section in the `src/db/README.md` file. 