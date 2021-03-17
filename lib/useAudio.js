import { useState, useEffect } from 'react';

let audio;

const useAudio = (url, onEnded) => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [ended, setEnded] = useState(0);

  const play = () => {
    audio
      .play()
      .then((res) => console.log({ res }))
      .catch((err) => console.log({ audio, err }));
  };
  const stop = () => {
    audio.pause();
    setIsPlaying(false);
  };
  const toggle = () => {
    if (isPlaying) stop();
    else play();
  };

  useEffect(() => {
    if (url) {
      audio = new Audio(url);
      audio.addEventListener('ended', stop);
      audio.addEventListener('canplay', () => {
        setDuration(audio.duration);
      });
      audio.addEventListener('play', () => {
        setIsPlaying(true);
      });
      return () => {
        audio.removeEventListener('ended', stop);
        audio.removeEventListener('canplay', stop);
        audio.removeEventListener('play', stop);
        onEnded();
      };
    }
  }, [url, onEnded]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (audio?.played.length) {
        setPlayed(audio.played.end(0));
      }
      if (audio.ended) {
        setEnded(true);
        onEnded();
      }
    }, 100);
    return () => clearInterval(interval);
  }, [setPlayed, onEnded]);

  return {
    stop,
    play,
    toggle,
    isPlaying,
    ended,
    duration,
    played,
  };
};

export default useAudio;
