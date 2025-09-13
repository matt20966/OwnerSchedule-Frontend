import React, { useState } from 'react';
import Modal from 'react-modal';
import { CloseIcon } from './UIComponents';
import styles from './combinedSettingsSeries.module.css'; // import CSS

const EditSeriesModal = ({ isOpen, onConfirm, onCancel, editType: initialEditType }) => {
  const [editType, setEditType] = useState(initialEditType);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={styles['modal-container']}
      overlayClassName={styles['modal-overlay']}
      appElement={document.getElementById('root')}
    >
      <div className={styles['modal-header']}>
        <h2 className={styles['modal-title']}>Edit Recurring Event</h2>
        <button className={styles['close-button']} onClick={onCancel}>
          <CloseIcon size={20} color="#64748b" />
        </button>
      </div>

      <div className={styles['form-content']}>
        <p>How would you like to apply this change?</p>
        <div className={styles['option-container']}>
          {['single', 'future', 'all'].map((option) => (
            <label key={option} className={styles['option-label']}>
              <input
                type="radio"
                className={styles['hidden-input']}
                name="editType"
                value={option}
                checked={editType === option}
                onChange={() => setEditType(option)}
              />
              <span className={styles['custom-radio']}>
                <span className={styles['custom-radio-inner']}></span>
              </span>
              <span>
                {option === 'single'
                  ? 'This event only'
                  : option === 'future'
                  ? 'This and all future events'
                  : 'All events in the series'}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles['modal-footer']}>
        <button className={`${styles.button} ${styles['btn-cancel']}`} onClick={onCancel}>
          Cancel
        </button>
        <button className={`${styles.button} ${styles['btn-save']}`} onClick={() => onConfirm(editType)}>
          Confirm
        </button>
      </div>
    </Modal>
  );
};

export default EditSeriesModal;
