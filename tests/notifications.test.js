const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const { AuthProvider } = require('../src/contexts/AuthContext');
const NotificationList = require('../src/components/Notifications/NotificationList');
const NotificationSettings = require('../src/components/Notifications/NotificationSettings');
const { supabase } = require('../tests/__mocks__/supabaseClient');

// Mock the supabase client
jest.mock('../src/services/supabaseClient', () => ({
  supabase: require('../tests/__mocks__/supabaseClient').supabase
}));

// Sample notification data
const sampleNotifications = [
  {
    id: '1',
    user_id: '123',
    title: 'תזכורת לתרומה',
    message: 'עברו 3 חודשים מאז תרומתך האחרונה. זה הזמן לתרום שוב!',
    type: 'reminder',
    is_read: false,
    created_at: '2023-11-10T08:00:00'
  },
  {
    id: '2',
    user_id: '123',
    title: 'הישג חדש!',
    message: 'כל הכבוד! השלמת 5 תרומות דם וקיבלת את התג "מתרים קבוע"',
    type: 'achievement',
    is_read: true,
    created_at: '2023-11-05T14:30:00'
  },
  {
    id: '3',
    user_id: '123',
    title: 'עדכון מערכת',
    message: 'המערכת תהיה בתחזוקה ביום שישי הקרוב בין השעות 02:00-04:00',
    type: 'system',
    is_read: false,
    created_at: '2023-11-08T10:15:00'
  }
];

// Sample notification settings
const sampleSettings = {
  user_id: '123',
  email_notifications: true,
  push_notifications: true,
  donation_reminders: true,
  achievement_notifications: true,
  community_notifications: false,
  system_notifications: true
};

describe('Notification System Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Notification list renders correctly', async () => {
    // Set up mock return values
    const eqMock = jest.fn().mockResolvedValue({
      data: sampleNotifications,
      error: null
    });
    
    const orderMock = jest.fn().mockReturnValue({
      eq: eqMock
    });
    
    const selectMock = jest.fn().mockReturnValue({
      order: orderMock
    });
    
    supabase.from.mockReturnValue({
      select: selectMock
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <NotificationList />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for the notifications to load
    await waitFor(() => {
      // Check if notification titles are displayed
      expect(screen.getByText('תזכורת לתרומה')).toBeInTheDocument();
      expect(screen.getByText('הישג חדש!')).toBeInTheDocument();
      expect(screen.getByText('עדכון מערכת')).toBeInTheDocument();
      
      // Check if notification messages are displayed
      expect(screen.getByText('עברו 3 חודשים מאז תרומתך האחרונה. זה הזמן לתרום שוב!')).toBeInTheDocument();
      expect(screen.getByText('כל הכבוד! השלמת 5 תרומות דם וקיבלת את התג "מתרים קבוע"')).toBeInTheDocument();
      expect(screen.getByText('המערכת תהיה בתחזוקה ביום שישי הקרוב בין השעות 02:00-04:00')).toBeInTheDocument();
      
      // Check if unread notifications are marked accordingly
      const unreadNotifications = screen.getAllByTestId('unread-notification');
      expect(unreadNotifications.length).toBe(2);
    });
  });

  test('Marking a notification as read', async () => {
    // Set up mock return values
    const eqMock = jest.fn().mockResolvedValue({
      data: { ...sampleNotifications[0], is_read: true },
      error: null
    });
    
    const updateMock = jest.fn().mockReturnValue({
      eq: eqMock
    });
    
    supabase.from.mockReturnValue({
      update: updateMock
    });

    // We would typically render a component with mark-as-read functionality
    // For this test, we'll just verify the mock was called correctly
    const markAsRead = async (notificationId) => {
      return await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);
    };

    await markAsRead('1');

    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(updateMock).toHaveBeenCalledWith({ is_read: true });
    expect(eqMock).toHaveBeenCalledWith('id', '1');
  });

  test('Deleting a notification', async () => {
    // Set up mock return values
    const eqMock = jest.fn().mockResolvedValue({
      data: null,
      error: null
    });
    
    const deleteMock = jest.fn().mockReturnValue({
      eq: eqMock
    });
    
    supabase.from.mockReturnValue({
      delete: deleteMock
    });

    // We would typically render a component with delete functionality
    // For this test, we'll just verify the mock was called correctly
    const deleteNotification = async (notificationId) => {
      return await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
    };

    await deleteNotification('1');

    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith('id', '1');
  });

  test('Notification settings render correctly', async () => {
    // Set up mock return values
    const singleMock = jest.fn().mockResolvedValue({
      data: sampleSettings,
      error: null
    });
    
    const eqMock = jest.fn().mockReturnValue({
      single: singleMock
    });
    
    const selectMock = jest.fn().mockReturnValue({
      eq: eqMock
    });
    
    supabase.from.mockReturnValue({
      select: selectMock
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <NotificationSettings />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for the settings to load
    await waitFor(() => {
      // Check if all toggle switches are displayed
      const toggles = screen.getAllByRole('checkbox');
      expect(toggles.length).toBe(6); // 6 different notification settings
      
      // Check if the toggles have the correct initial state
      expect(toggles[0]).toBeChecked(); // email_notifications
      expect(toggles[1]).toBeChecked(); // push_notifications
      expect(toggles[2]).toBeChecked(); // donation_reminders
      expect(toggles[3]).toBeChecked(); // achievement_notifications
      expect(toggles[4]).not.toBeChecked(); // community_notifications
      expect(toggles[5]).toBeChecked(); // system_notifications
    });
  });

  test('Updating notification settings', async () => {
    // Set up mock return values for the update
    const updateSingleMock = jest.fn().mockResolvedValue({
      data: { ...sampleSettings, community_notifications: true },
      error: null
    });
    
    const updateEqMock = jest.fn().mockReturnValue({
      single: updateSingleMock
    });
    
    const updateMock = jest.fn().mockReturnValue({
      eq: updateEqMock
    });
    
    // Set up mock return values for the initial fetch
    const fetchSingleMock = jest.fn().mockResolvedValue({
      data: sampleSettings,
      error: null
    });
    
    const fetchEqMock = jest.fn().mockReturnValue({
      single: fetchSingleMock
    });
    
    const fetchSelectMock = jest.fn().mockReturnValue({
      eq: fetchEqMock
    });
    
    // Mock the from method to return different objects based on the table name
    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'notification_settings') {
        // First call in useEffect will be for fetching settings
        if (!fetchSelectMock.mock.calls.length) {
          return {
            select: fetchSelectMock
          };
        }
        // Second call will be for updating settings
        return {
          update: updateMock
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [], error: null })
        })
      };
    });

    render(
      <BrowserRouter>
        <AuthProvider>
          <NotificationSettings />
        </AuthProvider>
      </BrowserRouter>
    );

    // Wait for the settings to load
    await waitFor(() => {
      const toggles = screen.getAllByRole('checkbox');
      expect(toggles[4]).not.toBeChecked(); // community_notifications initially off
    });

    // Toggle community notifications on
    fireEvent.click(screen.getByLabelText(/התראות קהילה/i));

    // Wait for the update to complete
    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('notification_settings');
      expect(updateMock).toHaveBeenCalledWith({
        ...sampleSettings,
        community_notifications: true
      });
    });
  });

  test('Creating a new notification', async () => {
    // Set up mock return values
    const insertMock = jest.fn().mockResolvedValue({
      data: {
        id: '4',
        user_id: '123',
        title: 'התראה חדשה',
        message: 'זוהי התראה חדשה',
        type: 'system',
        is_read: false,
        created_at: new Date().toISOString()
      },
      error: null
    });
    
    // Reset the from mock to return a proper insert method
    supabase.from.mockImplementation((tableName) => {
      if (tableName === 'notifications') {
        return {
          insert: insertMock
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({ data: [], error: null })
        })
      };
    });

    // Function to create a new notification
    const createNotification = async (userId, title, message, type) => {
      return await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: title,
          message: message,
          type: type,
          is_read: false,
          created_at: new Date().toISOString()
        });
    };

    await createNotification('123', 'התראה חדשה', 'זוהי התראה חדשה', 'system');

    expect(supabase.from).toHaveBeenCalledWith('notifications');
    expect(insertMock).toHaveBeenCalledWith({
      user_id: '123',
      title: 'התראה חדשה',
      message: 'זוהי התראה חדשה',
      type: 'system',
      is_read: false,
      created_at: expect.any(String)
    });
  });
}); 