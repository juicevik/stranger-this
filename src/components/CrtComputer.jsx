import React from 'react';
import GameFrame from './GameFrame';
import { gameMeta } from '../data/gameMeta';

const CrtComputer = ({
  hasStarted,
  isGameLoaded,
  isMuted,
  isExpanded,
  gameFrameRef,
  onStart,
  onGameLoad,
}) => (
  <section
    className={`reference-crt-screen ${hasStarted ? 'reference-crt-active' : ''} ${isExpanded ? 'reference-crt-expanded' : ''}`}
    aria-label={`Old computer with embedded ${gameMeta.title} game`}
  >
    {hasStarted ? (
      <>
        {!isGameLoaded && <div className="screen-loading">LOADING</div>}
        <GameFrame ref={gameFrameRef} isMuted={isMuted} onLoad={onGameLoad} />
      </>
    ) : (
      <button className="start-hotspot" type="button" onClick={onStart}>
        <span className="sr-only">START</span>
      </button>
    )}
  </section>
);

export default CrtComputer;
