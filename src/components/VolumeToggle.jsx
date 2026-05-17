import React from 'react';

const VolumeToggle = ({ isMuted, onToggle }) => (
  <button
    className={`volume-toggle ${isMuted ? 'volume-toggle-muted' : ''}`}
    type="button"
    aria-label={isMuted ? 'Включить звук' : 'Выключить звук'}
    title={isMuted ? 'Включить звук' : 'Выключить звук'}
    onClick={onToggle}
  >
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path d="M4 12.5h5.6L17 6v20l-7.4-6.5H4z" />
      {!isMuted && <path d="M21.2 10.1c1.5 1.4 2.4 3.5 2.4 5.9s-.9 4.5-2.4 5.9" />}
      {!isMuted && <path d="M24.8 6.8c2.3 2.2 3.7 5.4 3.7 9.2s-1.4 7-3.7 9.2" />}
      {isMuted && <path d="M21.5 11.5 28 18m0-6.5L21.5 18" />}
    </svg>
  </button>
);

export default VolumeToggle;
