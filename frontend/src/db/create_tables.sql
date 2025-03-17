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