import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Licenses = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: #111;
  text-align: center;
  & > * {
    flex: 1 1 3rem;
    padding: 0.1rem 0.25rem;
    border-radius: 5px;
    margin: 0.1rem;
  }
  .no-signal,
  .no-app {
    background-color: #aaa;
  }
  .valide {
    background-color: #8f8;
  }
  .not-valide {
    background-color: #f88;
  }
  .nb-license {
    background-color: #eee;
    border: 1px solid #aaa;
  }
`;

export function LicensesDetailsApplication({ licenses }) {
  const [count, setCount] = useState({});
  const { t } = useTranslation('application');

  useEffect(() => {
    if (licenses) {
      const now = new Date();
      setCount(
        licenses.reduce(
          (cnt, l) => {
            if (!l.signal.id) {
              cnt.withoutSignal += 1;
            } else if (now > new Date(l.validity)) cnt.notValid += 1;
            else cnt.valid += 1;
            return cnt;
          },
          { withoutSignal: 0, valid: 0, notValid: 0 }
        )
      );
    }
  }, [licenses]);

  if (!licenses) return <p>???</p>;
  return (
    <Licenses>
      {licenses.length <= 0 && <span>{t('none')}</span>}
      {licenses.length > 0 && (
        <span className="nb-license">{licenses.length}</span>
      )}
      {count.withoutSignal > 0 && (
        <span className="no-signal">{count.withoutSignal}</span>
      )}
      {count.valid > 0 && <span className="valide">{count.valid}</span>}
      {count.notValid > 0 && (
        <span className="not-valide">{count.notValid}</span>
      )}
    </Licenses>
  );
}

LicensesDetailsApplication.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      signal: PropTypes.object.isRequired,
      validity: PropTypes.string.isRequired,
    })
  ),
};

export function LicensesLegendApplication() {
  const { t } = useTranslation('application');
  return (
    <Licenses>
      <span className="nb-license">{t('nb-license')}</span>
      <span className="no-signal">{t('no-signal')}</span>
      <span className="valide">{t('valide')}</span>
      <span className="not-valide">{t('not-valide')}</span>
    </Licenses>
  );
}

export function LicensesDetailsSignal({ licenses }) {
  const [count, setCount] = useState({});
  const { t } = useTranslation('signal');

  useEffect(() => {
    if (licenses) {
      const now = new Date();
      setCount(
        licenses.reduce(
          (cnt, l) => {
            if (!l.application.id) {
              cnt.withoutApp += 1;
            } else if (now > new Date(l.validity)) cnt.notValid += 1;
            else cnt.valid += 1;
            return cnt;
          },
          { withoutApp: 0, valid: 0, notValid: 0 }
        )
      );
    }
  }, [licenses]);

  if (!licenses) return <p>???</p>;
  return (
    <Licenses>
      {licenses.length <= 0 && <span>{t('no-license')}</span>}
      {licenses.length > 0 && (
        <span className="nb-license">{licenses.length}</span>
      )}
      {count.withoutSignal > 0 && (
        <span className="no-app">{count.withoutApp}</span>
      )}
      {count.valid > 0 && <span className="valide">{count.valid}</span>}
      {count.notValid > 0 && (
        <span className="not-valide">{count.notValid}</span>
      )}
    </Licenses>
  );
}

LicensesDetailsSignal.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      signal: PropTypes.object,
      validity: PropTypes.string,
    })
  ),
};

export function LicensesLegendSignal() {
  const { t } = useTranslation('signal');
  return (
    <Licenses>
      <span className="nb-license">{t('nb-license')}</span>
      <span className="no-app">{t('no-app')}</span>
      <span className="valide">{t('valide')}</span>
      <span className="not-valide">{t('not-valide')}</span>
    </Licenses>
  );
}
