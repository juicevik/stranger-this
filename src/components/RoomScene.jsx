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

  const playSiteAudio = useCallback(() => {
    const audio = siteAudioRef.current;
    if (!audio || isMutedRef.current || !canUseMediaPlayback()) {
      return Promise.resolve(false);
    }

    audio.muted = false;
    audio.volume = 1;

    const playResult = audio.play();
    if (!playResult || typeof playResult.then !== 'function') {
      return Promise.resolve(true);
    }

    return playResult
      .then(() => true)
      .catch(() => false);
  }, []);

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
    const audio = document.createElement('audio');
    audio.src = '/audio/stranger-think.m4a';
    audio.loop = true;
    audio.preload = 'auto';
    audio.autoplay = true;
    audio.volume = 1;
    audio.hidden = true;
    audio.setAttribute('playsinline', '');
    audio.setAttribute('webkit-playsinline', '');
    document.body.appendChild(audio);
    siteAudioRef.current = audio;
    let isDisposed = false;
    let unlockListenersActive = true;
    const unlockEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];
    const unlockListenerOptions = { capture: true };

    const removeUnlockListeners = () => {
      if (!unlockListenersActive) {
        return;
      }
      unlockEvents.forEach((eventName) => {
        document.removeEventListener(eventName, tryPlay, unlockListenerOptions);
      });
      unlockListenersActive = false;
    };

    const tryPlay = () => {
      playSiteAudio().then((didPlay) => {
        if (didPlay && !isDisposed) {
          removeUnlockListeners();
        }
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (canUseMediaPlayback()) {
          audio.pause();
        }
        return;
      }
      tryPlay();
    };

    unlockEvents.forEach((eventName) => {
      document.addEventListener(eventName, tryPlay, unlockListenerOptions);
    });
    audio.addEventListener('loadeddata', tryPlay);
    tryPlay();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isDisposed = true;
      removeUnlockListeners();
      if (canUseMediaPlayback()) {
        audio.pause();
      }
      audio.removeEventListener('loadeddata', tryPlay);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      siteAudioRef.current = null;
      audio.remove();
    };
  }, [playSiteAudio]);

  useEffect(() => {
    const audio = siteAudioRef.current;
    if (!audio) {
      return;
    }

    audio.muted = isMuted;
    audio.volume = isMuted ? 0 : 1;
  }, [isMuted]);

  const handleStart = useCallback(() => {
    playSiteAudio();
    setIsGameLoaded(false);
    setIsExpanded(true);
    setHasStarted(true);
    window.setTimeout(() => gameFrameRef.current?.focus(), 80);
  }, [playSiteAudio]);

  const handleExit = useCallback(() => {
    setHasStarted(false);
    setIsGameLoaded(false);
    setIsExpanded(false);
    window.setTimeout(() => {
      playSiteAudio();
    }, 0);
  }, [playSiteAudio]);

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
      <a
        className="portfolio-return-link"
        href="https://kalyakin.page.gd/portfolio"
        aria-label="На главную в портфолио сайта"
      >
        На главную
      </a>
      <div className="reference-header-mask" aria-hidden="true" />
      {isTouchLayout && orientation === 'portrait' && !hasStarted && (
        <div className="orientation-prompt" role="status">
          <div className="orientation-prompt-icon" aria-hidden="true" />
          <p>Поверните телефон горизонтально</p>
        </div>
      )}
      {(hasStarted || (isTouchLayout && orientation === 'landscape')) && (
        <GameSessionControls
          isExpanded={isExpanded}
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
              audio.volume = 1;
              playSiteAudio();
            }, 0);
          }
        }}
      />
      {isTouchLayout && orientation === 'landscape' && !hasStarted && (
        <button className="mobile-start-button" type="button" onClick={handleStart}>
          START
        </button>
      )}
      {hasStarted && isExpanded && isTouchLayout && (
        <MobileGameControls onControl={handleMobileControl} />
      )}
    </main>
  );
};

export default RoomScene;
