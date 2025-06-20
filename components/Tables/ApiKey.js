import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';
import { useClipboard } from 'use-clipboard-copy';

import ActionButton from '../Buttons/ActionButton';

const ApiKeyStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default function ApiKey({ apiKey = '', showCopied }) {
  const clipboard = useClipboard({
    copiedTimeout: 1000,
    onSuccess() {
      addToast(t('copied'), { appearance: 'success', autoDismiss: true });
    },
  });
  const { copied } = clipboard;
  const { t } = useTranslation('common');
  const { addToast } = useToasts();

  const lenKey = apiKey?.length ?? 0;
  const obfuscatedKey = [apiKey.slice(0, lenKey / 4), apiKey.slice((lenKey * 3) / 4)].join(
    '  ......  '
  );

  const copyApiKey = useCallback(() => {
    clipboard.copy(apiKey); // programmatically copying a value
  }, [clipboard, apiKey]);

  return (
    <ApiKeyStyled>
      <span>{obfuscatedKey}</span>
      <ActionButton type="copy" cb={copyApiKey} />
      {copied && showCopied && <span>{t('copied')}</span>}
    </ApiKeyStyled>
  );
}

ApiKey.propTypes = {
  apiKey: PropTypes.string.isRequired,
  showCopied: PropTypes.bool,
};
