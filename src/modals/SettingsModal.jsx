import React, { useState } from 'react';
import { CloseIcon } from './UIComponents.jsx';
import styles from './combinedSettingsSeries.module.css'; // unified CSS

const getTimezoneOffset = (tz) => {
  try {
    const now = new Date();
    const offset = now.toLocaleString('en-US', { timeZone: tz, timeZoneName: 'shortOffset' });
    const offsetMatch = offset.match(/GMT([+-]\d{1,2})|UTC([+-]\d{1,2})/i);
    if (offsetMatch) return ` (UTC${offsetMatch[1] || offsetMatch[2]})`;
    return ` (${now.toLocaleTimeString('en-US', { timeZone: tz, timeZoneName: 'short' })})`;
  } catch (e) {
    console.error(`Error getting timezone offset for ${tz}:`, e);
    return '';
  }
};

const commonTimezones = [
  { name: 'Europe/London', value: 'Europe/London' },
  { name: 'Europe/Paris', value: 'Europe/Paris' },
  { name: 'Asia/Tokyo', value: 'Asia/Tokyo' },
  { name: 'Asia/Shanghai', value: 'Asia/Shanghai' },
  { name: 'UTC', value: 'UTC' },
].map(tz => {
  const offsetLabel = tz.value === 'UTC' ? ' (UTC+0)' : getTimezoneOffset(tz.value);
  return { ...tz, label: `${tz.name}${offsetLabel}` };
});

const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [selectedTimezone, setSelectedTimezone] = useState(currentSettings.timezone);
  const [showExpanded, setShowExpanded] = useState(currentSettings.showExpanded);
  const [selectedSlotDuration, setSelectedSlotDuration] = useState(currentSettings.slotDuration || '00:30:00');

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      timezone: selectedTimezone,
      showExpanded,
      slotDuration: selectedSlotDuration,
    });
  };

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['modal-container']} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Settings</h2>
          <button className={styles['close-button']} onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className={styles['form-content']}>
          {/* Timezone */}
          <div className={styles['field']}>
            <label className={styles['label']} htmlFor="timezone-select">Timezone</label>
            <select
              id="timezone-select"
              className={styles['input']}
              value={selectedTimezone}
              onChange={(e) => setSelectedTimezone(e.target.value)}
            >
              {commonTimezones.map((tz) => (
                <option key={tz.value} value={tz.value}>{tz.label}</option>
              ))}
            </select>
          </div>

          {/* Slot Duration */}
          <div className={styles['field']}>
            <label className={styles['label']} htmlFor="slot-duration-select">Slot Duration</label>
            <select
              id="slot-duration-select"
              className={styles['input']}
              value={selectedSlotDuration}
              onChange={(e) => setSelectedSlotDuration(e.target.value)}
            >
              <option value="00:15:00">15 minutes</option>
              <option value="00:30:00">30 minutes</option>
              <option value="00:45:00">45 minutes</option>
              <option value="01:00:00">1 hour</option>
            </select>
          </div>

          {/* Show expanded checkbox */}
          <div className={styles['field']}>
            <label className={styles['option-label']} htmlFor="show-expanded">
              <input
                type="checkbox"
                id="show-expanded"
                className={styles['hidden-input']}
                checked={showExpanded}
                onChange={(e) => setShowExpanded(e.target.checked)}
              />
              <div className={styles['custom-checkbox']}>
                <div className={styles['checkmark']}></div>
              </div>
              <span>Show expanded occurrences</span>
            </label>
          </div>
        </div>

        {/* Footer / actions */}
        <div className={styles['modal-footer']}>
          <button className={`${styles.button} ${styles['btn-cancel']}`} onClick={onClose}>
            Cancel
          </button>
          <button className={`${styles.button} ${styles['btn-save']}`} onClick={handleSave}>
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
