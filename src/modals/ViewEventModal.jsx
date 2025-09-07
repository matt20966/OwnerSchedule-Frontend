// Modal to view event details.
import React from "react";
import { DateTime } from 'luxon';
import classes from "./ViewEventModal.module.css"; 

// A simple functional component to render an 'X' icon for closing the modal.
const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// The main ViewEventModal component.
// It receives props for visibility, closing, the event data, and an edit handler.
const ViewEventModal = ({ isOpen, onClose, event, onEdit }) => {
  // If the modal is not open or there's no event data, don't render anything.
  if (!isOpen || !event) return null;

  // --- Date and Time Formatting using Luxon ---
  const offsetMinutes = event.utcOffset * 60; 
  const startDateTime = DateTime.fromJSDate(new Date(event.start)).setZone(`UTC${event.utcOffset >= 0 ? '+' : ''}${event.utcOffset}`);
  const endDateTime = DateTime.fromJSDate(new Date(event.end)).setZone(`UTC${event.utcOffset >= 0 ? '+' : ''}${event.utcOffset}`);
  // Format the start date for display (e.g., "September 7, 2025").
  const eventDate = startDateTime.toLocaleString(DateTime.DATE_FULL);

  // --- Handlers ---
  // Handles copying the event link to the user's clipboard.
  const handleCopy = () => {
    if (event.link) {
      navigator.clipboard.writeText(event.link)
        .then(() => {
          console.log("Link copied to clipboard!"); 
        })
        .catch(err => {
          console.error("Failed to copy link: ", err); 
        });
    }
  };

  // --- Helper Functions ---
  // Formats the recurring event string based on frequency and total count.
  const getRepeatString = (frequency, frequency_total) => {
    // Return a default string if not a recurring event.
    if (!frequency_total || frequency_total < 1 || frequency === 'never') {
        return "No recurring event";
    }

    // Handle the 'forever' case
    if (frequency_total === 9999) {
        return "Forever";
    }

    // Use a switch statement for different frequency types.
    switch (frequency) {
        case 'daily': {
            const days = frequency_total;
            const weeks = Math.floor(days / 7);
            const remainingDays = days % 7;
            let durationString = '';

            if (weeks > 0) {
                durationString += `${weeks} ${weeks > 1 ? 'weeks' : 'week'}`;
            }
            if (remainingDays > 0) {
                if (durationString) {
                    durationString += ' and ';
                }
                durationString += `${remainingDays} ${remainingDays > 1 ? 'days' : 'day'}`;
            }
            return `Every day for ${durationString}`;
        }
        case 'every_work_day': {
            const days = frequency_total;
            const workWeeks = Math.floor(days / 5);
            const remainingWorkDays = days % 5;
            let durationString = '';

            if (workWeeks > 0) {
                durationString += `${workWeeks} ${workWeeks > 1 ? 'work weeks' : 'work week'}`;
            }
            if (remainingWorkDays > 0) {
                if (durationString) {
                    durationString += ' and ';
                }
                durationString += `${remainingWorkDays} ${remainingWorkDays > 1 ? 'work days' : 'work day'}`;
            }
            return `Every work day for ${durationString}`;
        }
        case 'weekly': {
            // Use Math.ceil to round up to the nearest whole week.
            const weeks = Math.ceil(frequency_total / 7);
            return `Every week for ${weeks} ${weeks > 1 ? 'weeks' : 'week'}`;
        }
        case 'fortnightly': {
            const fortnights = Math.ceil(frequency_total / 14);
            return `Every fortnight for ${fortnights} ${fortnights > 1 ? 'fortnights' : 'fortnight'}`;
        }
        default:
            return "No recurring event";
    }
  };

  // --- JSX Rendering ---
  return (
    // The overlay for the modal, which closes the modal when clicked.
    <div className={classes.overlay} onClick={onClose}>
      {/* The modal itself, which stops click propagation to prevent closing when clicked inside. */}
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        
        {/* Modal header with title and close button. */}
        <div className={classes.header}>
          <h2 className={classes.title}>{event.title}</h2>
          {/* Close button with ARIA label for accessibility. */}
          <button className={classes['close-button']} onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Content section for event details. */}
        <div className={classes['form-content']}>
          {/* Display date, formatted by Luxon. */}
          <div className={classes.field}><strong>Date:</strong> {eventDate}</div>
          {/* Display time range. */}
          <div className={classes.field}>
            <strong>Time:</strong> {startDateTime.toFormat('h:mm a')} - {endDateTime.toFormat('h:mm a')}
          </div>
          
          {/* Conditionally render the 'Repeats' field only if the event belongs to a series. */}
          {event.series && (
            <>
              <div className={classes.field}>
                <strong>Repeats:</strong>{" "}
                {/* Call the helper function to get the formatted repeat string. */}
                {getRepeatString(event.series.frequency, event.series.frequency_total)}
              </div>
            </>
          )}
          
          {/* Display the link with a copy button. */}
          <div className={classes['field-link']}>
            <strong>Link:</strong> 
            {event.link ? (
              <>
                <a href={event.link} target="_blank" rel="noopener noreferrer">{event.link}</a>
                {/* Copy button that triggers the handleCopy function. */}
                <button className={classes['copy-button']} onClick={handleCopy}>Copy</button>
              </>
            ) : "N/A"}
          </div>
          {/* Display event notes. */}
          <div className={classes.field}>
            <strong>Notes:</strong>
            <p style={{ margin: 0 }}>{event.notes || "No additional notes."}</p>
          </div>
        </div>

        {/* Action buttons section. */}
        <div className={classes.actions}>
          {/* Edit button. */}
          <button
            className={`${classes.button} ${classes['edit-button']}`}
            onClick={() => {
              // Calculate the total duration in minutes.
              const totalDurationInMinutes = endDateTime.diff(startDateTime, 'minutes').minutes;
              console.log("Event in ViewEventModal:", event);

              // Transform the event data into the format required by the edit handler.
              const transformedEvent = {
                ...event,
                datetime: startDateTime.toISO({ includeOffset: true }), // Use ISO format with offset
                duration: totalDurationInMinutes,
                // Set frequency and frequency_total based on the series data or defaults.
                frequency: event.series?.frequency || 'never',
                frequency_total: event.series?.frequency_total || 1,

              };
              // Call the onEdit prop with the transformed event data.
              onEdit(transformedEvent);
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

// Export the component as the default export.
export default ViewEventModal;