import React from 'react';
import GameFrame from './GameFrame';
import { gameMeta } from '../data/gameMeta';

const CrtComputer = ({
  hasStarted,
  isGameLoaded,
  isMuted,
  isExpanded,
  gameSessionId,
  gameFrameRef,
  onStart,
  onGameLoad,
}) => (
  <section
    className={`reference-crt-screen ${hasStarted ? 'reference-crt-active' : ''} ${isExpanded ? 'reference-crt-expanded' : ''}`}
    aria-label={`Old computer with embedded ${gameMeta.title} game`}
  >
    {hasStarted ? (
      <div className="crt-game-viewport">
        {!isGameLoaded && <div className="screen-loading">LOADING</div>}
        <GameFrame key={gameSessionId} ref={gameFrameRef} isMuted={isMuted} onLoad={onGameLoad} />
      </div>
    ) : (
      <button className="start-hotspot" type="button" onClick={onStart}>
        <span className="sr-only">START</span>
      </button>
    )}
  </section>
);

export default CrtComputer;
