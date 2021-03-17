import PropTypes from 'prop-types';
import AudioControls from './AudioControls';
import useAudio from '../../lib/useAudio';

export default function AudioPlayer({
  trackName,
  audioSrc,
  onEnded,
  onDownloadClick,
}) {
  const { toggle, isPlaying, duration, played } = useAudio(audioSrc, onEnded);

  return (
    <AudioControls
      trackName={trackName}
      isPlaying={isPlaying}
      onPlayPauseClick={toggle}
      trackProgress={played}
      duration={duration}
      onDownloadClick={onDownloadClick}
    />
  );
}

AudioPlayer.propTypes = {
  trackName: PropTypes.string,
  audioSrc: PropTypes.string,
  onEnded: PropTypes.func.isRequired,
  onDownloadClick: PropTypes.func,
};
