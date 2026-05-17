import React from 'react';

const GameSessionControls = ({
  isExpanded,
  showExpandToggle = true,
  onExit,
  onToggleExpanded,
}) => (
  <div
    className={`game-session-controls ${isExpanded ? 'game-session-controls-expanded' : ''}`}
    aria-label="Управление игровой сессией"
  >
    <button className="game-session-button" type="button" onClick={onExit}>
      Выйти
    </button>
    {showExpandToggle && (
      <button className="game-session-button" type="button" onClick={onToggleExpanded}>
        {isExpanded ? 'Свернуть' : 'Развернуть'}
      </button>
    )}
  </div>
);

export default GameSessionControls;
