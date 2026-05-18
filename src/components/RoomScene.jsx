import React, { useCallback, useEffect, useRef, useState } from 'react';
import CrtComputer from './CrtComputer';
import GameSessionControls from './GameSessionControls';
import MobileGameControls from './MobileGameControls';
import VolumeToggle from './VolumeToggle';
import { gameMeta } from '../data/gameMeta';
import '../styles/room.css';
import '../styles/crt.css';
import '../styles/responsive.css';

const getViewportType = () => {
  if (window.innerWidth < 720) {
    return 'mobile';
  }
  if (window.innerWidth < 1100) {
    return 'tablet';
  }
  return 'desktop';
};

const canUseMediaPlayback = () => !navigator.userAgent.toLowerCase().includes('jsdom');

const getOrientation = () => (window.innerWidth > window.innerHeight ? 'landscape' : 'portrait');

const getIsTouchLayout = () => {
  const pointerIsCoarse = window.matchMedia?.('(pointer: coarse)').matches;
  return Boolean(pointerIsCoarse || window.innerWidth <= 920);
};

const RoomScene = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewportType, setViewportType] = useState(getViewportType);
  const [orientation, setOrientation] = useState(getOrientation);
  const [isTouchLayout, setIsTouchLayout] = useState(getIsTouchLayout);
  const siteAudioRef = useRef(null);
  const gameFrameRef = useRef(null);
  const isMutedRef = useRef(isMuted);
  const hasStartedRef = useRef(hasStarted);

  useEffect(() => {
    const updateViewport = () => {
      setViewportType(getViewportType());
      setOrientation(getOrientation());
      setIsTouchLayout(getIsTouchLayout());
    };
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
    };
  }, []);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    hasStartedRef.current = hasStarted;
  }, [hasStarted]);

  useEffect(() => {
    const audio = new Audio('/audio/stranger-think.m4a');
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = 0.4;
    siteAudioRef.current = audio;

    const tryPlay = () => {
      if (!canUseMediaPlayback() || isMutedRef.current) {
        return;
      }
      audio.play().catch(() => {});
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (canUseMediaPlayback()) {
          audio.pause();
        }
        return;
      }
      if (!isMutedRef.current && !hasStartedRef.current) {
        audio.play().catch(() => {});
      }
    };

    tryPlay();
    window.addEventListener('pointerdown', tryPlay, { once: true });
    window.addEventListener('keydown', tryPlay, { once: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (canUseMediaPlayback()) {
        audio.pause();
      }
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      siteAudioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = siteAudioRef.current;
    if (!audio) {
      return;
    }

    audio.muted = isMuted;
    audio.volume = isMuted ? 0 : 0.4;
  }, [isMuted]);

  const handleStart = useCallback(() => {
    if (canUseMediaPlayback()) {
      siteAudioRef.current?.pause();
    }
    setIsGameLoaded(false);
    setIsExpanded(getIsTouchLayout());
    setHasStarted(true);
    window.setTimeout(() => gameFrameRef.current?.focus(), 80);
  }, []);

  const handleExit = useCallback(() => {
    setHasStarted(false);
    setIsGameLoaded(false);
    setIsExpanded(false);
    window.setTimeout(() => {
      const audio = siteAudioRef.current;
      if (!audio || isMutedRef.current || !canUseMediaPlayback()) {
        return;
      }
      audio.play().catch(() => {});
    }, 0);
  }, []);

  useEffect(() => {
    const receiveGameMessage = (event) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'final-fate-exit') {
        return;
      }
      handleExit();
    };

    window.addEventListener('message', receiveGameMessage);
    return () => window.removeEventListener('message', receiveGameMessage);
  }, [handleExit]);

  const handleMobileControl = useCallback((control, active) => {
    gameFrameRef.current?.sendControl(control, active);
    gameFrameRef.current?.focus();
  }, []);

  return (
    <main
      className={[
        'game-room',
        `game-room-${viewportType}`,
        `game-room-${orientation}`,
        isTouchLayout ? 'game-room-touch' : '',
        isExpanded ? 'game-room-expanded' : '',
      ].filter(Boolean).join(' ')}
      style={{ '--room-reference-image': `url("${gameMeta.roomReferencePath}")` }}
    >
      <div className="reference-room-stage" aria-label="Retro room game start screen">
        <img
          className="reference-room-image"
          src={gameMeta.roomReferencePath}
          alt=""
          aria-hidden="true"
        />
        <CrtComputer
          hasStarted={hasStarted}
          isGameLoaded={isGameLoaded}
          isMuted={isMuted}
          isExpanded={isExpanded}
          gameFrameRef={gameFrameRef}
          onStart={handleStart}
          onGameLoad={() => setIsGameLoaded(true)}
        />
      </div>
      <div className="reference-header-mask" aria-hidden="true" />
      {isTouchLayout && orientation === 'portrait' && !hasStarted && (
        <div className="orientation-prompt" role="status">
          <div className="orientation-prompt-icon" aria-hidden="true" />
          <p>Поверните телефон горизонтально</p>
        </div>
      )}
      {hasStarted && (
        <GameSessionControls
          isExpanded={isExpanded}
          showExpandToggle={!isTouchLayout}
          onExit={handleExit}
          onToggleExpanded={() => setIsExpanded((current) => !current)}
        />
      )}
      <VolumeToggle
        isMuted={isMuted}
        onToggle={() => {
          setIsMuted((current) => !current);
          if (isMuted) {
            window.setTimeout(() => {
              const audio = siteAudioRef.current;
              if (!audio) {
                return;
              }
              audio.muted = false;
              audio.volume = 0.4;
              if (!canUseMediaPlayback()) {
                return;
              }
              audio.play().catch(() => {});
            }, 0);
          }
        }}
      />
      {hasStarted && isExpanded && isTouchLayout && (
        <MobileGameControls onControl={handleMobileControl} />
      )}
    </main>
  );
};

export default RoomScene;
