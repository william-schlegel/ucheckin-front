import PropTypes from 'prop-types';
import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { ButtonStyled } from '../styles/Button';
import ActionButton from './ActionButton';

export default function BackButton({ route, label }) {
  const { t } = useTranslation('common');
  return (
    <ButtonStyled type="button">
      <Link href={route}>
        <>
          <ActionButton type="back" label={label} />
          {t('back', { label })}
        </>
      </Link>
    </ButtonStyled>
  );
}

BackButton.propTypes = {
  route: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
