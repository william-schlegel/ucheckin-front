import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';
import { Play } from 'react-feather';
import styled from 'styled-components';

import useSocket from '../../lib/useSocket';

export default function UmixRT({ umixId, playNow, onPlay }) {
  const { t } = useTranslation('umix');
  const [connected, setConnected] = useState(false);
  useSocket(umixId, (data) => {
    setConnected(!!data?.connected);
  });

  return (
    <>
      <StatusContainer>
        <ColorBox color={connected ? 'var(--green)' : 'var(--red)'} />
        <span>{connected ? t('connected') : t('disconnected')}</span>
        {connected && playNow && (
          <Play
            style={{ marginLeft: 'auto' }}
            color="var(--primary)"
            onClick={() => onPlay(umixId)}
          />
        )}
      </StatusContainer>
    </>
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
