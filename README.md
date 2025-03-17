# Blood Donation Awareness Web Application

A comprehensive web application for blood donation awareness, education, and management.

## Features

- **Blood Type Information**: Learn about different blood types and their characteristics
- **Compatibility Checker**: Find out which blood types are compatible for donation and receiving
- **Regional Data**: View blood type distribution by region
- **User Dashboard**: Track your donation history and impact
- **Educational Quiz**: Test your knowledge about blood donation
- **Authentication**: Secure user accounts with Supabase authentication

## Tech Stack

- **Frontend**: React, TypeScript, React Router
- **Backend**: Supabase (PostgreSQL database with RESTful API)
- **Authentication**: Supabase Auth
- **Styling**: CSS with responsive design

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account

### Frontend Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```
   cd frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the frontend directory with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_URL=http://localhost:8000
   ```
5. Start the development server:
   ```
   npm start
   ```

### Supabase Setup

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. After creating your project, go to Settings > API to get your URL and anon key
3. In the SQL Editor, run the SQL script from `supabase_setup.sql` to create all necessary tables and sample data
4. Set up authentication:
   - Go to Authentication > Settings
   - Configure Email Auth (enable/disable email confirmations as needed)
   - Optionally set up social logins (Google, Facebook, etc.)
5. Update your frontend `.env` file with the Supabase URL and anon key

## Database Schema

The application uses the following tables:

- **user_profiles**: Extended user information
- **blood_types**: Blood type information
- **blood_compatibility**: Compatibility between blood types
- **regional_blood_data**: Regional statistics on blood types
- **quiz_questions**: Questions for the educational quiz
- **quiz_results**: User quiz results

## Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Supabase](https://supabase.io/) for the backend and authentication
- [React](https://reactjs.org/) for the frontend framework
- Blood donation organizations for educational information 