import React, { useState } from 'react';
import Modal from 'react-modal';


/**
 * A modal to ask the user whether to apply an edit to a single event,
 * all events in a series, or future events in a series.
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is open.
 * @param {function} props.onConfirm - Callback with the selected edit type.
 * @param {function} props.onCancel - Callback to close the modal without action.
 * @param {string} props.editType - The initial, preset edit type ('single', 'all', 'future').
 */
const EditSeriesModal = ({ isOpen, onConfirm, onCancel, editType: initialEditType }) => {
    const [editType, setEditType] = useState(initialEditType);

    const handleConfirm = () => {
        onConfirm(editType);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCancel}
            className="modal-container"
            overlayClassName="modal-overlay"
            appElement={document.getElementById('root')}
        >
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">Edit Recurring Event</h2>
                    <button onClick={handleCancel} className="close-button">&times;</button>
                </div>
                <div className="modal-body">
                    <p>How would you like to apply this change?</p>
                    <div className="edit-options">
                        <label className="edit-option">
                            <input
                                type="radio"
                                name="editType"
                                value="single"
                                checked={editType === 'single'}
                                onChange={() => setEditType('single')}
                            />
                            <span>This event only</span>
                        </label>
                        <label className="edit-option">
                            <input
                                type="radio"
                                name="editType"
                                value="future"
                                checked={editType === 'future'}
                                onChange={() => setEditType('future')}
                            />
                            <span>This and all future events</span>
                        </label>
                        <label className="edit-option">
                            <input
                                type="radio"
                                name="editType"
                                value="all"
                                checked={editType === 'all'}
                                onChange={() => setEditType('all')}
                            />
                            <span>All events in the series</span>
                        </label>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
                    <button className="btn-save" onClick={handleConfirm}>Confirm</button>
                </div>
            </div>
        </Modal>
    );
};

export default EditSeriesModal;