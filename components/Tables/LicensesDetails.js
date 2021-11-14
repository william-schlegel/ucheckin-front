import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { HelpCircle } from 'react-feather';
import styled from 'styled-components';

import { IconButtonStyles } from '../Buttons/ActionButton';

const Licenses = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  color: var(--text-color);
  text-align: center;
  & > * {
    flex: 1 1 1.5rem;
    align-items: center;
    padding: 0.1rem 0.25rem;
    border-radius: 5px;
    margin: 0.1rem;
  }
  .valide {
    background-color: #8f8;
    color: #111;
  }
  .not-valide {
    background-color: #f88;
    color: #111;
  }
  .nb-license {
    background-color: #eee;
    border: 1px solid #aaa;
    color: #111;
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
            if (now > new Date(l.validity)) cnt.notValid += 1;
            else cnt.valid += 1;
            return cnt;
          },
          { valid: 0, notValid: 0 }
        )
      );
    }
  }, [licenses]);

  if (!licenses) return <span>{t('common:no-license')}</span>;
  return (
    <Licenses>
      {licenses.length <= 0 && <span>{t('common:no-license')}</span>}
      {licenses.length > 0 && <span className="nb-license">{licenses.length}</span>}
      {count.valid > 0 && <span className="valide">{count.valid}</span>}
      {count.notValid > 0 && <span className="not-valide">{count.notValid}</span>}
    </Licenses>
  );
}

LicensesDetailsApplication.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      signal: PropTypes.object,
      validity: PropTypes.string,
    })
  ),
};

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: fit-content;
`;

const HelpButton = styled(IconButtonStyles)`
  position: relative;
  display: flex;
  gap: 1rem;
`;

const LegendContent = styled(Licenses)`
  position: absolute;
  left: 0;
  top: 100%;
  display: flex;
  flex-direction: column;
  flex: 1 1 400px;
`;

export function LicensesLegendApplication() {
  const { t } = useTranslation('application');
  const [helpVisible, setHelpVisible] = useState(false);
  function toggleHelp() {
    setHelpVisible(!helpVisible);
  }
  return (
    <ButtonContainer>
      <HelpButton onMouseEnter={toggleHelp} onMouseLeave={toggleHelp}>
        <HelpCircle />
        <span>{t('licenses')}</span>
        {helpVisible && (
          <LegendContent>
            <span className="nb-license">{t('nb-license')}</span>
            <span className="valide">{t('valide')}</span>
            <span className="not-valide">{t('not-valide')}</span>
          </LegendContent>
        )}
      </HelpButton>
    </ButtonContainer>
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
            if (now > new Date(l.validity)) cnt.notValid += 1;
            else cnt.valid += 1;
            return cnt;
          },
          { valid: 0, notValid: 0 }
        )
      );
    }
  }, [licenses]);

  if (!licenses) return <span>{t('common:no-license')}</span>;
  return (
    <Licenses>
      {licenses.length <= 0 && <span>{t('common:no-license')}</span>}
      {licenses.length > 0 && <span className="nb-license">{licenses.length}</span>}
      {count.valid > 0 && <span className="valide">{count.valid}</span>}
      {count.notValid > 0 && <span className="not-valide">{count.notValid}</span>}
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
  const [helpVisible, setHelpVisible] = useState(false);
  function toggleHelp() {
    setHelpVisible(!helpVisible);
  }
  const { t } = useTranslation('signal');
  return (
    <ButtonContainer>
      <HelpButton onMouseEnter={toggleHelp} onMouseLeave={toggleHelp}>
        <HelpCircle />
        <span>{t('licenses')}</span>
        {helpVisible && (
          <LegendContent>
            <span className="nb-license">{t('nb-license')}</span>
            <span className="valide">{t('valide')}</span>
            <span className="not-valide">{t('not-valide')}</span>
          </LegendContent>
        )}
      </HelpButton>
    </ButtonContainer>
  );
}

export function LicensesApplications({ licenses }) {
  if (!Array.isArray(licenses)) return null;
  return <div>{licenses.map((l) => l.application.name).join(', ')}</div>;
}
