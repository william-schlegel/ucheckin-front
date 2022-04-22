import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

export default function UmixRT({ connected }) {
  const { t } = useTranslation('umix');

  return (
    <StatusContainer>
      <ColorBox color={connected ? 'var(--green)' : 'var(--red)'} />
      <span>{connected ? t('connected') : t('disconnected')}</span>
    </StatusContainer>
  );
}

const StatusContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: start;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 1em;
`;

const ColorBox = styled.div`
  width: 1em;
  height: 1em;
  border: 1px solid #222;
  background-color: ${(props) => props.color};
`;
