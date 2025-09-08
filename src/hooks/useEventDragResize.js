import { useCallback } from 'react';
import { DateTime } from 'luxon';

/**
 * A custom hook to encapsulate the logic for handling event drag and drop
 * and resizing events within a FullCalendar component.
 * * @param {function} saveEventAndCommit - A function to save the event to the backend and
 * commit the action for undo/redo history.
 * @param {string} selectedTimezone - The currently selected timezone.
 * @returns {object} An object containing the onEventDrop and onEventResize callbacks.
 */
export const useEventDragResize = (saveEventAndCommit, selectedTimezone) => {

    /**
     * Handles drag-and-drop operations for an event.
     * It calculates the new duration and datetime and calls the save function.
     */
    const onEventDrop = useCallback(
        (info) => {
            const { event } = info;
            // Calculate duration in minutes.
            const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);

            // Set the new datetime to the selected timezone, keeping local time.
            const datetime = DateTime.fromJSDate(event.start)
                .setZone(selectedTimezone, { keepLocalTime: true })
                .toISO();

            const updatedEvent = {
                ...event.extendedProps,
                id: event.id,
                title: event.title,
                datetime: datetime,
                duration: duration,
                notes: event.extendedProps.notes,
                link: event.extendedProps.link,
            };
            // Drag-and-drop always affects a single instance.
            saveEventAndCommit(updatedEvent, 'single');
        },
        [saveEventAndCommit, selectedTimezone]
    );

    /**
     * Handles resizing an event.
     * It calculates the new duration and datetime and calls the save function.
     */
    const onEventResize = useCallback(
        (info) => {
            const { event } = info;
            // Calculate duration in minutes.
            const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);

            // Set the new datetime to the selected timezone, keeping local time.
            const datetime = DateTime.fromJSDate(event.start)
                .setZone(selectedTimezone, { keepLocalTime: true })
                .toISO();
            const updatedEvent = {
                ...event.extendedProps,
                id: event.id,
                title: event.title,
                datetime: datetime,
                duration: duration,
                notes: event.extendedProps.notes,
                link: event.extendedProps.link,
            };
            // Resizing always affects a single instance.
            saveEventAndCommit(updatedEvent, 'single');
        },
        [saveEventAndCommit, selectedTimezone]
    );

    return { onEventDrop, onEventResize };
};