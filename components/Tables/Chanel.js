import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

const chanelList = [
  { id: 'CH1', fc: 17500 },
  { id: 'CH2', fc: 18500 },
  { id: 'CH3', fc: 19500 },
  { id: 'CH4', fc: 20500 },
  { id: 'ADV', fc: 0 },
];

export function useChanel() {
  const { t } = useTranslation('signal');
  const chanelOptions = useMemo(
    () => chanelList.map((c) => ({ value: c.id, label: t(c.id) })),
    [t]
  );

  function getChanelName(code) {
    if (chanelList.findIndex((c) => c.id === code) < 0)
      return t('unknown-chanel', { chanel: code });
    return t(code);
  }
  function getChanelFC(code) {
    const chId = chanelList.findIndex((c) => c.id === code);
    if (chId < 0) return t('unknown-chanel', { chanel: code });
    return chanelList[chId].fc;
  }

  return { chanelList, getChanelName, getChanelFC, chanelOptions };
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
