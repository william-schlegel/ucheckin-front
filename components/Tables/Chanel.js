import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const chanelList = ['CH1', 'CH2', 'CH3', 'CH4', 'ADV'];

export function useChanel() {
  const { t } = useTranslation('signal');
  const chanelOptions = useMemo(
    () => chanelList.map((c) => ({ value: c, label: t(c) })),
    [t]
  );

  function getChanelName(code) {
    if (chanelList.findIndex((c) => c === code) < 0)
      return t('unknown-chanel', { chanel: code });
    return t(code);
  }

  return { chanelList, getChanelName, chanelOptions };
}

export default function Chanel({ chanel }) {
  const { getChanelName } = useChanel();
  return <span>{getChanelName(chanel)}</span>;
}

Chanel.defaultProps = {
  chanel: 'CH2',
};

Chanel.propTypes = {
  chanel: PropTypes.string,
};
