import { supabase } from './supabaseClient';

// Types for the dashboard
export interface Donation {
  id: number;
  user_id: string;
  donation_date: string;
  donation_center: string;
  blood_amount_ml: number;
  donation_type: string;
  notes: string;
  created_at: string;
}

export interface DonationGoal {
  id: number;
  user_id: string;
  target_count: number;
  target_date: string | null;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  criteria: string;
  created_at: string;
}

export interface UserAchievement {
  id: number;
  user_id: string;
  achievement_id: number;
  earned_at: string;
  achievement?: Achievement; // Join with achievements table
}

export interface DonationReminder {
  id: number;
  user_id: string;
  reminder_date: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

// Donation functions
export const getUserDonations = async (userId: string): Promise<{ data: Donation[] | null; error: any }> => {
  console.log('Fetching donations for user:', userId);
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('user_id', userId)
    .order('donation_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching user donations:', error);
  } else {
    console.log(`Retrieved ${data?.length || 0} donations`);
  }
  
  return { data, error };
};

export const addDonation = async (donation: Omit<Donation, 'id' | 'created_at'>): Promise<{ data: Donation | null; error: any }> => {
  console.log('Adding new donation:', donation);
  const { data, error } = await supabase
    .from('donations')
    .insert(donation)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding donation:', error);
  } else {
    console.log('Donation added successfully');
  }
  
  return { data, error };
};

export const updateDonation = async (id: number, updates: Partial<Donation>): Promise<{ data: Donation | null; error: any }> => {
  console.log(`Updating donation ${id}:`, updates);
  const { data, error } = await supabase
    .from('donations')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating donation:', error);
  } else {
    console.log('Donation updated successfully');
  }
  
  return { data, error };
};

export const deleteDonation = async (id: number): Promise<{ error: any }> => {
  console.log(`Deleting donation ${id}`);
  const { error } = await supabase
    .from('donations')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting donation:', error);
  } else {
    console.log('Donation deleted successfully');
  }
  
  return { error };
};

// Donation Goals functions
export const getUserDonationGoals = async (userId: string): Promise<{ data: DonationGoal[] | null; error: any }> => {
  console.log('Fetching donation goals for user:', userId);
  const { data, error } = await supabase
    .from('donation_goals')
    .select('*')
    .eq('user_id', userId)
    .order('target_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching user donation goals:', error);
  } else {
    console.log(`Retrieved ${data?.length || 0} donation goals`);
  }
  
  return { data, error };
};

export const addDonationGoal = async (goal: Omit<DonationGoal, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: DonationGoal | null; error: any }> => {
  console.log('Adding new donation goal:', goal);
  const { data, error } = await supabase
    .from('donation_goals')
    .insert(goal)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding donation goal:', error);
  } else {
    console.log('Donation goal added successfully');
  }
  
  return { data, error };
};

export const updateDonationGoal = async (id: number, updates: Partial<DonationGoal>): Promise<{ data: DonationGoal | null; error: any }> => {
  console.log(`Updating donation goal ${id}:`, updates);
  const { data, error } = await supabase
    .from('donation_goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating donation goal:', error);
  } else {
    console.log('Donation goal updated successfully');
  }
  
  return { data, error };
};

// Achievements functions
export const getAllAchievements = async (): Promise<{ data: Achievement[] | null; error: any }> => {
  console.log('Fetching all achievements');
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .order('id');
  
  if (error) {
    console.error('Error fetching achievements:', error);
  } else {
    console.log(`Retrieved ${data?.length || 0} achievements`);
  }
  
  return { data, error };
};

export const getUserAchievements = async (userId: string): Promise<{ data: UserAchievement[] | null; error: any }> => {
  console.log('Fetching achievements for user:', userId);
  const { data, error } = await supabase
    .from('user_achievements')
    .select(`
      *,
      achievement:achievements(*)
    `)
    .eq('user_id', userId)
    .order('earned_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching user achievements:', error);
  } else {
    console.log(`Retrieved ${data?.length || 0} user achievements`);
  }
  
  return { data, error };
};

export const addUserAchievement = async (userId: string, achievementId: number): Promise<{ data: UserAchievement | null; error: any }> => {
  console.log(`Adding achievement ${achievementId} to user ${userId}`);
  const { data, error } = await supabase
    .from('user_achievements')
    .insert({
      user_id: userId,
      achievement_id: achievementId
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding user achievement:', error);
  } else {
    console.log('User achievement added successfully');
  }
  
  return { data, error };
};

// Reminders functions
export const getUserReminders = async (userId: string): Promise<{ data: DonationReminder[] | null; error: any }> => {
  console.log('Fetching reminders for user:', userId);
  const { data, error } = await supabase
    .from('donation_reminders')
    .select('*')
    .eq('user_id', userId)
    .order('reminder_date', { ascending: true });
  
  if (error) {
    console.error('Error fetching user reminders:', error);
  } else {
    console.log(`Retrieved ${data?.length || 0} reminders`);
  }
  
  return { data, error };
};

export const addReminder = async (reminder: Omit<DonationReminder, 'id' | 'created_at'>): Promise<{ data: DonationReminder | null; error: any }> => {
  console.log('Adding new reminder:', reminder);
  const { data, error } = await supabase
    .from('donation_reminders')
    .insert(reminder)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding reminder:', error);
  } else {
    console.log('Reminder added successfully');
  }
  
  return { data, error };
};

export const markReminderAsRead = async (id: number): Promise<{ data: DonationReminder | null; error: any }> => {
  console.log(`Marking reminder ${id} as read`);
  const { data, error } = await supabase
    .from('donation_reminders')
    .update({ is_read: true })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error marking reminder as read:', error);
  } else {
    console.log('Reminder marked as read successfully');
  }
  
  return { data, error };
};

// Utility functions for dashboard
export const calculateNextDonationDate = (lastDonationDate: string): Date => {
  // Typically, donors can donate whole blood every 56 days (8 weeks)
  const lastDonation = new Date(lastDonationDate);
  const nextDonation = new Date(lastDonation);
  nextDonation.setDate(lastDonation.getDate() + 56);
  return nextDonation;
};

export const checkEligibleAchievements = async (userId: string, donationCount: number): Promise<Achievement[]> => {
  console.log(`Checking eligible achievements for user ${userId} with ${donationCount} donations`);
  
  // Get all achievements
  const { data: allAchievements } = await getAllAchievements();
  if (!allAchievements) return [];
  
  // Get user's existing achievements
  const { data: userAchievements } = await getUserAchievements(userId);
  const existingAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];
  
  // Filter achievements user is eligible for but doesn't have yet
  const eligibleAchievements = allAchievements.filter(achievement => {
    // Skip if user already has this achievement
    if (existingAchievementIds.includes(achievement.id)) return false;
    
    // Check donation count based achievements
    if (achievement.criteria.includes('Complete ')) {
      const requiredCount = parseInt(achievement.criteria.split('Complete ')[1].split(' ')[0]);
      return donationCount >= requiredCount;
    }
    
    return false;
  });
  
  console.log(`Found ${eligibleAchievements.length} eligible achievements`);
  return eligibleAchievements;
}; 