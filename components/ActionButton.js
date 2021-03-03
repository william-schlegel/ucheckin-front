import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { Edit } from 'react-feather';
import IconButtonStyles from './styles/IconButton';

export default function ActionButton({ type, cb }) {
  const { t } = useTranslation('common');
  return (
    <IconButtonStyles key={type} type="button" onClick={cb} title={t(type)}>
      {type === 'edit' && <Edit />}
    </IconButtonStyles>
  );
}

ActionButton.propTypes = {
  type: PropTypes.string.isRequired,
  cb: PropTypes.func.isRequired,
};
