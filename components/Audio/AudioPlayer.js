import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import AudioControls from './AudioControls';

export default function AudioPlayer({ trackName, audioSrc, onEnded }) {
  // State
  const [trackProgress, setTrackProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  // Refs
  const audioRef = useRef(new Audio(audioSrc));
  const intervalRef = useRef();
  const isReady = useRef(false);
  const { duration } = audioRef.current;

  useEffect(
    () =>
      // Pause and clean up on unmount
      () => {
        audioRef.current.pause();
        clearInterval(intervalRef.current);
      },
    []
  );

  const startTimer = useCallback(() => {
    // Clear any timers already running
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (audioRef.current.ended) {
        onEnded();
      } else {
        setTrackProgress(audioRef.current.currentTime);
      }
    }, [1000]);
  }, [onEnded]);

  useEffect(() => {
    audioRef.current.pause();

    audioRef.current = new Audio(audioSrc);
    setTrackProgress(audioRef.current.currentTime);

    if (isReady.current) {
      audioRef.current.play();
      setIsPlaying(true);
      startTimer();
    } else {
      // Set the isReady ref as true for the next pass
      isReady.current = true;
    }
  }, [audioSrc, startTimer]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
      startTimer();
    } else {
      clearInterval(intervalRef.current);
      audioRef.current.pause();
    }
  }, [isPlaying, startTimer]);

  return (
    <AudioControls
      trackName={trackName}
      isPlaying={isPlaying}
      onPlayPauseClick={setIsPlaying}
      trackProgress={trackProgress}
      duration={duration}
    />
  );
}

AudioPlayer.propTypes = {
  trackName: PropTypes.string,
  audioSrc: PropTypes.string,
  onEnded: PropTypes.func.isRequired,
};
