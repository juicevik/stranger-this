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
      <button
        className="game-session-button game-session-button-expand"
        type="button"
        aria-label={isExpanded ? 'Свернуть игру' : 'Развернуть игру'}
        title={isExpanded ? 'Свернуть игру' : 'Развернуть игру'}
        onClick={onToggleExpanded}
      >
        <span aria-hidden="true">{isExpanded ? '↙' : '⛶'}</span>
      </button>
    )}
  </div>
);

export default GameSessionControls;
