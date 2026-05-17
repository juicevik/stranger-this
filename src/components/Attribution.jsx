import React from 'react';
import { gameMeta } from '../data/gameMeta';

const Attribution = () => (
  <footer className="game-attribution" aria-label="Game attribution">
    <span>{gameMeta.title}</span>
    <a href={gameMeta.sourceUrl} target="_blank" rel="noreferrer">
      GitHub
    </a>
    <span>{gameMeta.license}</span>
    <span>{gameMeta.author}</span>
  </footer>
);

export default Attribution;

