import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useClipboard } from 'use-clipboard-copy';
import { Notify } from 'notiflix';
import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';
import ActionButton from '../Buttons/ActionButton';

const ApiKeyStyled = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default function ApiKey({ apiKey, showCopied }) {
  const clipboard = useClipboard({
    copiedTimeout: 1000,
  });
  const { copied } = clipboard;
  const { t } = useTranslation();
  const lenKey = apiKey.length;
  const obfuscatedKey = [
    apiKey.slice(0, lenKey / 4),
    apiKey.slice((lenKey * 3) / 4),
  ].join('...');

  useEffect(() => {
    if (copied) {
      Notify.Success(t('common:copied'));
    }
  }, [copied, t]);

  function copyApiKey() {
    clipboard.copy(apiKey);
  }

  return (
    <ApiKeyStyled>
      <span>{obfuscatedKey}</span>
      <ActionButton type="copy" cb={copyApiKey} />
      {copied && showCopied && <span>{t('common:copied')}</span>}
    </ApiKeyStyled>
  );
}

ApiKey.propTypes = {
  apiKey: PropTypes.string.isRequired,
  showCopied: PropTypes.bool,
};
