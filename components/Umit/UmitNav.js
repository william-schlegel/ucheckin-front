import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Help, HelpButton, useHelp } from '../Help';
import { ButtonStyled } from '../styles/Button';
import { Flex } from '../styles/Form';

export default function UmitNav({ active }) {
  const { t } = useTranslation('umit');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('umit');
  return (
    <UmitNavBar>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <Flex>
        <h3>{t('umit')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
      </Flex>
      <UmitNavButton active={active === 'measures'}>
        <Link href="/umit/measures">{t('measures')}</Link>
      </UmitNavButton>
      <UmitNavButton active={active === 'sensors'}>
        <Link href="/umit/sensors">{t('sensors')}</Link>
      </UmitNavButton>
      <UmitNavButton active={active === 'locations'}>
        <Link href="/umit/locations">{t('locations')}</Link>
      </UmitNavButton>
      <UmitNavButton active={active === 'materials'}>
        <Link href="/umit/materials">{t('materials')}</Link>
      </UmitNavButton>
    </UmitNavBar>
  );
}

const UmitNavButton = styled(ButtonStyled)`
  font-size: 1.3rem;
  font-weight: 700;
  --hover-color: white;
  --color: white;
  --bg-hover-color: ${(props) => (props.active ? 'var(--primary)' : 'var(--secondary)')};
  --bg-color: ${(props) => (props.active ? 'var(--secondary)' : 'var(--primary)')};
`;

const UmitNavBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-grey);
  h3 {
    display: inline-block;
    color: var(--secondary);
    font-weight: 500;
    font-size: 2rem;
    margin: 0 1rem 0 0;
    line-height: 1rem;
  }
`;

UmitNav.propTypes = {
  active: PropTypes.string,
};
