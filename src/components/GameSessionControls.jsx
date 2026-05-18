import React from 'react';

const GameSessionControls = ({
  isExpanded,
  isFullscreenActive = false,
  showExpandToggle = true,
  showFullscreenButton = false,
  onToggleExpanded,
  onEnterFullscreen,
}) => (
  <div
    className={`game-session-controls ${isExpanded ? 'game-session-controls-expanded' : ''}`}
    aria-label="Управление игровой сессией"
  >
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
    {showFullscreenButton && (
      <button
        className={`game-session-button game-session-button-fullscreen ${isFullscreenActive ? 'game-session-button-active' : ''}`}
        type="button"
        aria-label={isFullscreenActive ? 'Полноэкранный режим активен' : 'Во весь экран'}
        title={isFullscreenActive ? 'Полноэкранный режим активен' : 'Во весь экран'}
        onClick={onEnterFullscreen}
      >
        <span aria-hidden="true">⛶</span>
      </button>
    )}
  </div>
);

export default GameSessionControls;
