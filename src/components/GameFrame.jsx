import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { gameMeta } from '../data/gameMeta';

const setFrameMediaMuted = (frame, isMuted) => {
  const frameDocument = frame?.contentDocument;

  if (!frameDocument) {
    return;
  }

  frameDocument.querySelectorAll('audio, video').forEach((mediaElement) => {
    mediaElement.muted = isMuted;
    mediaElement.volume = isMuted ? 0 : 1;
  });
};

const canFocusFrameWindow = () => !navigator.userAgent.toLowerCase().includes('jsdom');

const GameFrame = forwardRef(({ isMuted, onLoad }, ref) => {
  const frameRef = useRef(null);

  const stopFrame = useCallback(() => {
    const frame = frameRef.current;

    if (!frame) {
      return;
    }

    try {
      frame.contentWindow?.postMessage({ type: 'final-fate-stop' }, window.location.origin);
      frame.contentWindow?.stopStrangerArcade?.();
    } catch {
      // The frame is same-origin in production; this is only a defensive cleanup path.
    }

    frame.src = 'about:blank';
  }, []);

  const applyMutedState = useCallback(() => {
    setFrameMediaMuted(frameRef.current, isMuted);
  }, [isMuted]);

  const postToGame = useCallback((payload) => {
    frameRef.current?.contentWindow?.postMessage(payload, window.location.origin);
  }, []);

  const focusGame = useCallback(() => {
    frameRef.current?.focus();
    if (canFocusFrameWindow()) {
      frameRef.current?.contentWindow?.focus();
    }
  }, []);

  useImperativeHandle(ref, () => ({
    sendControl(control, active) {
      postToGame({
        type: 'final-fate-control',
        control,
        active,
      });
    },
    focus: focusGame,
    stop: stopFrame,
  }), [focusGame, postToGame, stopFrame]);

  useEffect(() => {
    applyMutedState();
    postToGame({
      type: 'final-fate-muted',
      muted: isMuted,
    });
  }, [applyMutedState, isMuted, postToGame]);

  const handleLoad = () => {
    applyMutedState();
    focusGame();
    onLoad?.();
  };

  return (
    <iframe
      ref={frameRef}
      className="game-frame"
      title={`${gameMeta.title} browser game`}
      src={gameMeta.localPath}
      onLoad={handleLoad}
      allow="autoplay; fullscreen; gamepad"
      tabIndex="0"
    />
  );
});

export default GameFrame;
