// AddEventModal.test.jsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddEventModal from './AddEventModal';
import { DateTime } from 'luxon';

// Describe the test suite for the AddEventModal component
describe('AddEventModal', () => {
    // Create mock functions for props to track calls and arguments
    const mockOnClose = jest.fn();
    const mockOnAddEvent = jest.fn();

    // Define a set of default props for a consistent testing environment
    const defaultProps = {
        isOpen: true,
        onClose: mockOnClose,
        onAddEvent: mockOnAddEvent,
    };

    // Reset the mock functions before each test to ensure test isolation
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test case: The modal should render when the isOpen prop is true
    test('renders modal when isOpen is true', () => {
        render(<AddEventModal {...defaultProps} />);
        
        // Assert that key elements of the modal are present in the document
        expect(screen.getByText(/Add New Event/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Start Time/i)).toBeInTheDocument();
    });

    // Test case: The modal should not render when the isOpen prop is false
    test('does not render modal when isOpen is false', () => {
        render(<AddEventModal {...defaultProps} isOpen={false} />);
        
        // Assert that a key element of the modal is *not* present
        expect(screen.queryByText(/Add New Event/i)).not.toBeInTheDocument();
    });

    // Test case: Form validation should be triggered and display error messages
    test('shows validation errors for required fields', () => {
        render(<AddEventModal {...defaultProps} />);
        
        // Simulate a click on the "Add Event" button without filling out the form
        fireEvent.click(screen.getByText(/Add Event/i));

        // Assert that all expected validation error messages are visible
        expect(screen.getByText(/Title is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Date is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Start time is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Please fix the validation errors/i)).toBeInTheDocument();
    });

    // Test case: The onClose function should be called when the Cancel button is clicked
    test('calls onClose when Cancel button is clicked', () => {
        render(<AddEventModal {...defaultProps} />);
        
        // Simulate a click on the "Cancel" button
        fireEvent.click(screen.getByText(/Cancel/i));
        
        // Assert that the mock onClose function was called exactly once
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    // Test case: The onAddEvent function should be called with correct data for a valid form submission
    test('calls onAddEvent with correct data when form is valid', () => {
        render(<AddEventModal {...defaultProps} />);

        // Fill out the required form fields
        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Team Meeting' } });
        fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-09-10' } });
        fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '09:30' } });

        // Simulate a click on the "Add Event" button
        fireEvent.click(screen.getByText(/Add Event/i));

        // Define the expected Luxon DateTime object
        const expectedDateTime = DateTime.fromISO('2025-09-10T09:30').toISO({ includeOffset: true });

        // Assert that the mock onAddEvent function was called with the correct data
        expect(mockOnAddEvent).toHaveBeenCalledTimes(1);
        expect(mockOnAddEvent).toHaveBeenCalledWith(expect.objectContaining({
            title: 'Team Meeting',
            datetime: expectedDateTime,
            duration: 60, // Assumes a default duration of 60 minutes
        }));
        
        // Assert that the modal also closes after a successful submission
        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    // Test case: The form should show an error for an invalid date (e.g., non-existent date like Feb 29 in a non-leap year)
    test('shows error for invalid date (non-leap year Feb 29)', () => {
        render(<AddEventModal {...defaultProps} />);

        // Fill out the form with a valid title/time but an invalid date
        fireEvent.change(screen.getByLabelText(/Title/i), { target: { value: 'Leap Test' } });
        fireEvent.change(screen.getByLabelText(/Date/i), { target: { value: '2025-02-29' } }); // 2025 is not a leap year
        fireEvent.change(screen.getByLabelText(/Start Time/i), { target: { value: '10:00' } });

        // Simulate form submission
        fireEvent.click(screen.getByText(/Add Event/i));

        // Assert that the specific date validation error is shown to the user
        expect(screen.getByText(/You can't select February 29th in 2025/i)).toBeInTheDocument();
        
        // Assert that the onAddEvent function was NOT called due to the validation error
        expect(mockOnAddEvent).not.toHaveBeenCalled();
    });
});