import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { ButtonStyled } from '../styles/Button';

export default function UmitNav({ active }) {
  const { t } = useTranslation('umit');
  return (
    <NavBar>
      <NavButton active={active === 'measures'}>
        <Link href="/umit/measures">{t('measures')}</Link>
      </NavButton>
      <NavButton active={active === 'sensors'}>
        <Link href="/umit/sensors">{t('sensors')}</Link>
      </NavButton>
      <NavButton active={active === 'locations'}>
        <Link href="/umit/locations">{t('locations')}</Link>
      </NavButton>
      <NavButton active={active === 'materials'}>
        <Link href="/umit/materials">{t('materials')}</Link>
      </NavButton>
    </NavBar>
  );
}

const NavButton = styled(ButtonStyled)`
  font-size: 1.3rem;
  font-weight: 700;
  --hover-color: white;
  --color: white;
  --bg-hover-color: ${(props) => (props.active ? 'var(--primary)' : 'var(--secondary)')};
  --bg-color: ${(props) => (props.active ? 'var(--secondary)' : 'var(--primary)')};
`;

const NavBar = styled.div`
  display: flex;
  gap: 10px;
  padding: 0.5rem 0;
  margin-bottom: 0.5rem;
  border-bottom: 1px solid var(--light-grey);
`;

UmitNav.propTypes = {
  active: PropTypes.string,
};
