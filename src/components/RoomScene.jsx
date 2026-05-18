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

const getFullscreenElement = () => (
  document.fullscreenElement
  || document.webkitFullscreenElement
  || document.mozFullScreenElement
  || document.msFullscreenElement
);

const RoomScene = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [isGameLoaded, setIsGameLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [gameSessionId, setGameSessionId] = useState(0);
  const [viewportType, setViewportType] = useState(getViewportType);
  const [orientation, setOrientation] = useState(getOrientation);
  const [isTouchLayout, setIsTouchLayout] = useState(getIsTouchLayout);
  const roomRef = useRef(null);
  const siteAudioRef = useRef(null);
  const gameFrameRef = useRef(null);
  const isMutedRef = useRef(isMuted);

  const syncVisualViewport = useCallback(() => {
    const viewport = window.visualViewport;
    const width = viewport?.width || window.innerWidth;
    const height = viewport?.height || window.innerHeight;
    const offsetLeft = viewport?.offsetLeft || 0;
    const offsetTop = viewport?.offsetTop || 0;
    const root = document.documentElement;

    root.style.setProperty('--app-visual-width', `${width}px`);
    root.style.setProperty('--app-visual-height', `${height}px`);
    root.style.setProperty('--app-visual-offset-left', `${offsetLeft}px`);
    root.style.setProperty('--app-visual-offset-top', `${offsetTop}px`);
  }, []);

  const enterNativeFullscreen = useCallback(() => {
    syncVisualViewport();
    const element = roomRef.current;
    const requestFullscreen = element?.requestFullscreen
      || element?.webkitRequestFullscreen
      || element?.webkitRequestFullScreen
      || element?.mozRequestFullScreen
      || element?.msRequestFullscreen;

    if (!requestFullscreen) {
      return Promise.resolve(false);
    }

    try {
      const result = requestFullscreen.call(element, { navigationUI: 'hide' });
      return Promise.resolve(result)
        .then(() => true)
        .catch(() => false);
    } catch {
      return Promise.resolve(false);
    }
  }, [syncVisualViewport]);

  const exitNativeFullscreen = useCallback(() => {
    const exitFullscreen = document.exitFullscreen
      || document.webkitExitFullscreen
      || document.webkitCancelFullScreen
      || document.mozCancelFullScreen
      || document.msExitFullscreen;

    if (!getFullscreenElement() || !exitFullscreen) {
      setIsNativeFullscreen(false);
      return Promise.resolve(false);
    }

    try {
      const result = exitFullscreen.call(document);
      return Promise.resolve(result)
        .then(() => {
          setIsNativeFullscreen(false);
          return true;
        })
        .catch(() => false);
    } catch {
      return Promise.resolve(false);
    }
  }, []);

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
      syncVisualViewport();
      setViewportType(getViewportType());
      setOrientation(getOrientation());
      setIsTouchLayout(getIsTouchLayout());
    };
    syncVisualViewport();
    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    window.visualViewport?.addEventListener('resize', updateViewport);
    window.visualViewport?.addEventListener('scroll', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      window.visualViewport?.removeEventListener('resize', updateViewport);
      window.visualViewport?.removeEventListener('scroll', updateViewport);
    };
  }, [syncVisualViewport]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen(Boolean(getFullscreenElement()));
      syncVisualViewport();
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [syncVisualViewport]);

  useEffect(() => {
    const shouldLockSession = isTouchLayout;
    let lastTouchEnd = 0;
    let lastTouchStart = 0;

    document.documentElement.classList.toggle('game-session-lock', shouldLockSession);
    document.body.classList.toggle('game-session-lock', shouldLockSession);

    if (!shouldLockSession) {
      return () => {};
    }

    const preventGesture = (event) => event.preventDefault();
    const preventFastDoubleTouchStart = (event) => {
      const now = Date.now();
      if (now - lastTouchStart < 360) {
        event.preventDefault();
        syncVisualViewport();
      }
      lastTouchStart = now;
    };
    const preventFastDoubleTap = (event) => {
      const now = Date.now();
      if (now - lastTouchEnd < 360) {
        event.preventDefault();
        syncVisualViewport();
      }
      lastTouchEnd = now;
    };

    syncVisualViewport();
    document.addEventListener('touchstart', preventFastDoubleTouchStart, { capture: true, passive: false });
    document.addEventListener('dblclick', preventGesture, { capture: true, passive: false });
    document.addEventListener('touchend', preventFastDoubleTap, { capture: true, passive: false });
    document.addEventListener('gesturestart', preventGesture, { capture: true, passive: false });
    document.addEventListener('gesturechange', preventGesture, { capture: true, passive: false });
    document.addEventListener('gestureend', preventGesture, { capture: true, passive: false });

    return () => {
      document.removeEventListener('dblclick', preventGesture, { capture: true, passive: false });
      document.removeEventListener('touchstart', preventFastDoubleTouchStart, { capture: true, passive: false });
      document.removeEventListener('touchend', preventFastDoubleTap, { capture: true, passive: false });
      document.removeEventListener('gesturestart', preventGesture, { capture: true, passive: false });
      document.removeEventListener('gesturechange', preventGesture, { capture: true, passive: false });
      document.removeEventListener('gestureend', preventGesture, { capture: true, passive: false });
      document.documentElement.classList.remove('game-session-lock');
      document.body.classList.remove('game-session-lock');
    };
  }, [isTouchLayout, syncVisualViewport]);

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
    if (isTouchLayout && orientation === 'landscape') {
      enterNativeFullscreen();
    }
    setIsGameLoaded(false);
    setIsExpanded(true);
    setHasStarted(true);
    window.setTimeout(() => gameFrameRef.current?.focus(), 80);
  }, [enterNativeFullscreen, isTouchLayout, orientation, playSiteAudio]);

  const handleExit = useCallback(() => {
    gameFrameRef.current?.stop();
    exitNativeFullscreen();
    setHasStarted(false);
    setIsGameLoaded(false);
    setIsExpanded(false);
    setGameSessionId((current) => current + 1);
    window.setTimeout(() => {
      playSiteAudio();
    }, 0);
  }, [exitNativeFullscreen, playSiteAudio]);

  const handleToggleExpanded = useCallback(() => {
    setIsExpanded((current) => {
      const nextExpanded = !current;
      if (nextExpanded) {
        enterNativeFullscreen();
      } else {
        exitNativeFullscreen();
      }
      return nextExpanded;
    });
    window.setTimeout(() => gameFrameRef.current?.focus(), 80);
  }, [enterNativeFullscreen, exitNativeFullscreen]);

  const handleEnterFullscreen = useCallback(() => {
    setIsExpanded(true);
    enterNativeFullscreen();
    window.setTimeout(() => {
      syncVisualViewport();
      gameFrameRef.current?.focus();
    }, 80);
  }, [enterNativeFullscreen, syncVisualViewport]);

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
        isNativeFullscreen ? 'game-room-native-fullscreen' : '',
      ].filter(Boolean).join(' ')}
      ref={roomRef}
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
          gameSessionId={gameSessionId}
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
          isFullscreenActive={isNativeFullscreen}
          showFullscreenButton={hasStarted && isTouchLayout && isExpanded}
          onExit={handleExit}
          onToggleExpanded={handleToggleExpanded}
          onEnterFullscreen={handleEnterFullscreen}
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
