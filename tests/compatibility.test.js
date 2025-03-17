import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../src/contexts/AuthContext';
import BloodCompatibilityChecker from '../src/components/BloodCompatibility/BloodCompatibilityChecker';

describe('Blood Compatibility Tests', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <BloodCompatibilityChecker />
        </AuthProvider>
      </BrowserRouter>
    );
  });

  test('Compatibility checker renders correctly', () => {
    expect(screen.getByLabelText(/סוג דם של התורם/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/סוג דם של המקבל/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /בדוק תאימות/i })).toBeInTheDocument();
  });

  test('Compatible blood types show positive result', () => {
    // Select O+ donor
    fireEvent.change(screen.getByLabelText(/סוג דם של התורם/i), {
      target: { value: 'O+' }
    });
    
    // Select AB+ recipient
    fireEvent.change(screen.getByLabelText(/סוג דם של המקבל/i), {
      target: { value: 'AB+' }
    });
    
    // Check compatibility
    fireEvent.click(screen.getByRole('button', { name: /בדוק תאימות/i }));
    
    // Verify result
    expect(screen.getByRole('heading', { name: /תואם/i })).toBeInTheDocument();
    expect(screen.getByText(/O\+ יכול לתרום ל-AB\+/i)).toBeInTheDocument();
  });

  test('Incompatible blood types show negative result', () => {
    // Select AB+ donor
    fireEvent.change(screen.getByLabelText(/סוג דם של התורם/i), {
      target: { value: 'AB+' }
    });
    
    // Select O- recipient
    fireEvent.change(screen.getByLabelText(/סוג דם של המקבל/i), {
      target: { value: 'O-' }
    });
    
    // Check compatibility
    fireEvent.click(screen.getByRole('button', { name: /בדוק תאימות/i }));
    
    // Verify result
    expect(screen.getByRole('heading', { name: /לא תואם/i })).toBeInTheDocument();
    expect(screen.getByText(/AB\+ אינו יכול לתרום ל-O\-/i)).toBeInTheDocument();
  });

  test('Universal donor (O-) is compatible with all recipients', () => {
    // Select O- donor (universal donor)
    fireEvent.change(screen.getByLabelText(/סוג דם של התורם/i), {
      target: { value: 'O-' }
    });
    
    // Test with all recipient types
    const recipientTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    
    recipientTypes.forEach(recipientType => {
      // Select recipient type
      fireEvent.change(screen.getByLabelText(/סוג דם של המקבל/i), {
        target: { value: recipientType }
      });
      
      // Check compatibility
      fireEvent.click(screen.getByRole('button', { name: /בדוק תאימות/i }));
      
      // Verify result
      expect(screen.getByRole('heading', { name: /תואם/i })).toBeInTheDocument();
    });
  });

  test('Universal recipient (AB+) is compatible with all donors', () => {
    // Select AB+ recipient (universal recipient)
    fireEvent.change(screen.getByLabelText(/סוג דם של המקבל/i), {
      target: { value: 'AB+' }
    });
    
    // Test with all donor types
    const donorTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    
    donorTypes.forEach(donorType => {
      // Select donor type
      fireEvent.change(screen.getByLabelText(/סוג דם של התורם/i), {
        target: { value: donorType }
      });
      
      // Check compatibility
      fireEvent.click(screen.getByRole('button', { name: /בדוק תאימות/i }));
      
      // Verify result
      expect(screen.getByRole('heading', { name: /תואם/i })).toBeInTheDocument();
    });
  });

  test('Same blood type is always compatible', () => {
    const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    
    bloodTypes.forEach(bloodType => {
      // Select same blood type for donor and recipient
      fireEvent.change(screen.getByLabelText(/סוג דם של התורם/i), {
        target: { value: bloodType }
      });
      
      fireEvent.change(screen.getByLabelText(/סוג דם של המקבל/i), {
        target: { value: bloodType }
      });
      
      // Check compatibility
      fireEvent.click(screen.getByRole('button', { name: /בדוק תאימות/i }));
      
      // Verify result
      expect(screen.getByRole('heading', { name: /תואם/i })).toBeInTheDocument();
    });
  });
}); 