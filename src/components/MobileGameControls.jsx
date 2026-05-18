import React from 'react';

const MobileGameButton = ({ control, label, className = '', onControl }) => {
  const press = (event) => {
    event.preventDefault();
    onControl(control, true);
  };

  const release = (event) => {
    event.preventDefault();
    onControl(control, false);
  };

  return (
    <button
      className={`mobile-game-zone ${className}`}
      type="button"
      aria-label={label}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerLeave={release}
      onContextMenu={(event) => event.preventDefault()}
    >
      <span aria-hidden="true">{label}</span>
    </button>
  );
};

const MobileGameControls = ({ onControl }) => (
  <div className="mobile-game-controls" aria-label="Мобильное управление игрой">
    <MobileGameButton control="left" label="Назад" className="mobile-game-zone-left" onControl={onControl} />
    <MobileGameButton control="right" label="Вперед" className="mobile-game-zone-right" onControl={onControl} />
    <MobileGameButton control="shoot" label="Огонь" className="mobile-game-zone-fire" onControl={onControl} />
  </div>
);

export default MobileGameControls;
