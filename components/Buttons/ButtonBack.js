import PropTypes from 'prop-types';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import Router from 'next/router';

import { ButtonStyled } from '../styles/Button';
import ActionButton from './ActionButton';

export default function BackButton({ route, label }) {
  const { t } = useTranslation('common');
  return (
    <Link href={route}>
      <ButtonStyled type="button">
        <ActionButton type="back" label={label} cb={() => Router.push(route)} />
        {t('back', { label })}
      </ButtonStyled>
    </Link>
  );
}

BackButton.propTypes = {
  route: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
