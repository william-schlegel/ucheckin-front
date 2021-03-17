import useTranslation from 'next-translate/useTranslation';
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
  span {
    white-space: nowrap;
  }
`;

const PgBar = styled.div`
  width: 100%;
  height: 0.5rem;
  border: 1px solid var(--gray);
  .pgbar-progress {
    width: ${(props) => props.value}%;
    background-color: var(--pink);
    height: 100%;
  }
`;

export default function AudioControls({
  trackName,
  isPlaying,
  onPlayPauseClick,
  trackProgress,
  duration,
  onDownloadClick,
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
      {onDownloadClick && <ActionButton type="download" cb={onDownloadClick} />}
    </PlayerControl>
  );
}

AudioControls.propTypes = {
  trackName: PropTypes.string,
  isPlaying: PropTypes.bool,
  onPlayPauseClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
  trackProgress: PropTypes.number,
  duration: PropTypes.number,
};

function ProgressBar({ duration, value }) {
  const { lang } = useTranslation();

  function formatNumber(number) {
    const options = {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    };
    const formatter = Intl.NumberFormat(lang, options);
    return formatter.format(number);
  }
  if (!duration) return <div>---</div>;
  return (
    <>
      <PgBar value={(value / duration) * 100}>
        <div className="pgbar-progress" />
      </PgBar>
      <span>
        {formatNumber(value)} / {formatNumber(duration)} s
      </span>
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
