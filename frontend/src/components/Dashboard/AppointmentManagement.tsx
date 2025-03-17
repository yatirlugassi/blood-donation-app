import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faLocationDot, 
  faClock,
  faCalendarCheck,
  faCalendarXmark,
  faMapLocationDot,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

// Mock data - In a real app, this would come from an API
interface DonationCenter {
  id: number;
  name: string;
  address: string;
  distance: number; // in miles
  availableTimes: string[];
}

interface Appointment {
  id: number;
  userId: string;
  centerId: number;
  centerName: string;
  centerAddress: string;
  appointmentDate: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  donationType: string;
}

interface AppointmentManagementProps {
  userId: string;
}

const AppointmentManagement: React.FC<AppointmentManagementProps> = ({ userId }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [nearbyCenters, setNearbyCenters] = useState<DonationCenter[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  const [selectedCenter, setSelectedCenter] = useState<DonationCenter | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('Whole Blood');
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate API call to get user appointments
    const fetchAppointments = async () => {
      setLoading(true);
      
      // Mock data - In a real app, this would be fetched from a backend API
      setTimeout(() => {
        const mockAppointments: Appointment[] = [
          {
            id: 1,
            userId,
            centerId: 1,
            centerName: 'Red Cross Donation Center',
            centerAddress: '123 Main St, Anytown, USA',
            appointmentDate: '2025-04-10T14:30:00',
            status: 'scheduled',
            donationType: 'Whole Blood'
          },
          {
            id: 2,
            userId,
            centerId: 2,
            centerName: 'Community Blood Center',
            centerAddress: '456 Oak Ave, Somewhere, USA',
            appointmentDate: '2025-05-15T10:00:00',
            status: 'scheduled',
            donationType: 'Platelet'
          }
        ];
        
        setAppointments(mockAppointments);
        setLoading(false);
      }, 1000);
    };
    
    const fetchNearbyCenters = async () => {
      // Mock data - In a real app, this would be fetched based on user's location
      setTimeout(() => {
        const mockCenters: DonationCenter[] = [
          {
            id: 1,
            name: 'Red Cross Donation Center',
            address: '123 Main St, Anytown, USA',
            distance: 1.5,
            availableTimes: ['09:00', '10:30', '12:00', '13:30', '15:00', '16:30']
          },
          {
            id: 2,
            name: 'Community Blood Center',
            address: '456 Oak Ave, Somewhere, USA',
            distance: 3.2,
            availableTimes: ['08:30', '10:00', '11:30', '14:00', '15:30', '17:00']
          },
          {
            id: 3,
            name: 'Memorial Hospital Blood Center',
            address: '789 Elm Blvd, Nowhere, USA',
            distance: 5.8,
            availableTimes: ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30', '17:00']
          }
        ];
        
        setNearbyCenters(mockCenters);
      }, 1500);
    };
    
    fetchAppointments();
    fetchNearbyCenters();
  }, [userId]);
  
  // Get upcoming appointments (filter out past appointments)
  const upcomingAppointments = appointments
    .filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      const today = new Date();
      return appointmentDate > today && appointment.status === 'scheduled';
    })
    .sort((a, b) => {
      return new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime();
    });
  
  // Format appointment date for display
  const formatAppointmentDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'long',
      year: 'numeric',
      month: 'long', 
      day: 'numeric' 
    }) + ' at ' + date.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Handle appointment cancellation
  const handleCancelAppointment = (appointmentId: number) => {
    // In a real app, this would call an API to cancel the appointment
    setAppointments(appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        return {
          ...appointment,
          status: 'cancelled'
        };
      }
      return appointment;
    }));
  };
  
  // Handle new appointment scheduling
  const handleScheduleAppointment = () => {
    if (!selectedCenter || !selectedDate || !selectedTime || !selectedType) {
      alert('Please fill out all appointment details');
      return;
    }
    
    // In a real app, this would call an API to schedule the appointment
    const newAppointment: Appointment = {
      id: Math.floor(Math.random() * 1000),  // Generate random ID for mock data
      userId,
      centerId: selectedCenter.id,
      centerName: selectedCenter.name,
      centerAddress: selectedCenter.address,
      appointmentDate: `${selectedDate}T${selectedTime}:00`,
      status: 'scheduled',
      donationType: selectedType
    };
    
    setAppointments([...appointments, newAppointment]);
    setShowScheduleForm(false);
    setSelectedCenter(null);
    setSelectedDate('');
    setSelectedTime('');
  };
  
  // Generate available dates (next 30 days)
  const getAvailableDates = (): string[] => {
    const dates: string[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };
  
  return (
    <div className="appointment-management">
      <div className="appointment-header">
        <h2>Appointment Management</h2>
      </div>
      
      {loading ? (
        <div className="loading-appointments">
          <div className="spinner"></div>
          <p>Loading your appointments...</p>
        </div>
      ) : (
        <>
          <div className="upcoming-appointments-section">
            <h3>
              <FontAwesomeIcon icon={faCalendarCheck} />
              Upcoming Appointments
            </h3>
            
            {upcomingAppointments.length === 0 ? (
              <div className="no-appointments">
                <p>You don't have any upcoming appointments.</p>
              </div>
            ) : (
              <div className="appointment-list">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-details">
                      <div className="appointment-date">
                        <FontAwesomeIcon icon={faCalendarCheck} />
                        <span>{formatAppointmentDate(appointment.appointmentDate)}</span>
                      </div>
                      <div className="appointment-center">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>{appointment.centerName}</span>
                      </div>
                      <div className="appointment-type">
                        <span className="donation-type-badge">{appointment.donationType}</span>
                      </div>
                    </div>
                    <div className="appointment-actions">
                      <button 
                        className="cancel-appointment-btn"
                        onClick={() => handleCancelAppointment(appointment.id)}
                      >
                        <FontAwesomeIcon icon={faCalendarXmark} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {!showScheduleForm ? (
            <div className="schedule-button-container">
              <button 
                className="schedule-appointment-btn"
                onClick={() => setShowScheduleForm(true)}
              >
                <FontAwesomeIcon icon={faCalendarPlus} />
                Schedule New Donation
              </button>
            </div>
          ) : (
            <div className="schedule-form">
              <h3>Schedule New Appointment</h3>
              
              <div className="form-group">
                <label>Donation Center</label>
                <div className="center-selector">
                  {nearbyCenters.map((center) => (
                    <div 
                      key={center.id}
                      className={`center-option ${selectedCenter?.id === center.id ? 'selected' : ''}`}
                      onClick={() => setSelectedCenter(center)}
                    >
                      <div className="center-name">{center.name}</div>
                      <div className="center-location">
                        <FontAwesomeIcon icon={faLocationDot} />
                        <span>{center.address}</span>
                      </div>
                      <div className="center-distance">{center.distance} miles away</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedCenter && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Donation Date</label>
                      <select 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="date-select"
                      >
                        <option value="">Select a date</option>
                        {getAvailableDates().map((date) => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString(undefined, { 
                              weekday: 'long',
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Appointment Time</label>
                      <select 
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="time-select"
                        disabled={!selectedDate}
                      >
                        <option value="">Select a time</option>
                        {selectedCenter.availableTimes.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Donation Type</label>
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="type-select"
                    >
                      <option value="Whole Blood">Whole Blood</option>
                      <option value="Power Red">Power Red</option>
                      <option value="Platelet">Platelet</option>
                      <option value="Plasma">Plasma</option>
                    </select>
                  </div>
                </>
              )}
              
              <div className="form-actions">
                <button 
                  className="cancel-form-btn"
                  onClick={() => setShowScheduleForm(false)}
                >
                  Cancel
                </button>
                <button 
                  className="submit-form-btn"
                  onClick={handleScheduleAppointment}
                  disabled={!selectedCenter || !selectedDate || !selectedTime || !selectedType}
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          )}
          
          {/* Nearby Donation Centers Map View */}
          <div className="nearby-centers-section">
            <h3>
              <FontAwesomeIcon icon={faMapLocationDot} />
              Nearby Donation Centers
            </h3>
            
            <div className="centers-list">
              {nearbyCenters.map((center) => (
                <div key={center.id} className="center-card">
                  <div className="center-info">
                    <h4>{center.name}</h4>
                    <p className="center-address">
                      <FontAwesomeIcon icon={faLocationDot} />
                      {center.address}
                    </p>
                    <p className="center-distance">{center.distance} miles away</p>
                  </div>
                  <div className="center-action">
                    <button 
                      className="view-center-btn"
                      onClick={() => {
                        setSelectedCenter(center);
                        setShowScheduleForm(true);
                        window.scrollTo({
                          top: document.querySelector('.schedule-form')?.getBoundingClientRect().top || 0,
                          behavior: 'smooth'
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faCalendarPlus} />
                      Schedule Here
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="view-all-centers">
              <button className="view-all-btn">
                View All Donation Centers
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentManagement; 