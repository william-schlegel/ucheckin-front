import PropTypes from 'prop-types';
import styled from 'styled-components';
import ActionButton from '../Buttons/ActionButton';

const PlayerControl = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  margin: 0 0.5rem;
  padding: 0.5rem;
  border: 1px solid var(--gray);
  border-radius: 5px;
`;

const PgBar = styled.div`
  width: 100%;
  height: 0.5rem;
  border: 1px solid var(--gray);
`;

export default function AudioControls({
  trackName,
  isPlaying,
  onPlayPauseClick,
  trackProgress,
  duration,
}) {
  return (
    <PlayerControl>
      <span>{trackName}</span>
      {isPlaying ? (
        <ActionButton type="pause" cb={() => onPlayPauseClick(false)} />
      ) : (
        <ActionButton type="play" cb={() => onPlayPauseClick(true)} />
      )}
      <ProgressBar duration={duration} value={trackProgress} />
    </PlayerControl>
  );
}

AudioControls.propTypes = {
  trackName: PropTypes.string,
  isPlaying: PropTypes.bool,
  onPlayPauseClick: PropTypes.func,
  trackProgress: PropTypes.number,
  duration: PropTypes.number,
};

function ProgressBar({ duration, value }) {
  return (
    <>
      <PgBar value={value} />
      {duration}
    </>
  );
}

ProgressBar.defaultProps = {
  duration: 0,
  value: 0,
};

ProgressBar.propTypes = {
  duration: PropTypes.number,
  value: PropTypes.number,
};
