import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import {
  Copy,
  Edit,
  X,
  Calendar,
  ChevronLeft,
  Trash,
  Check,
} from 'react-feather';
import IconButtonStyles from './styles/IconButton';

export default function ActionButton({ type, cb, label }) {
  const { t } = useTranslation('common');
  return (
    <IconButtonStyles
      key={type}
      type="button"
      onClick={cb}
      title={label || t(type)}
    >
      {type === 'edit' && <Edit />}
      {type === 'check' && <Check />}
      {type === 'copy' && <Copy />}
      {type === 'delete' && <X />}
      {type === 'date' && <Calendar />}
      {type === 'back' && <ChevronLeft />}
      {type === 'trash' && <Trash />}
    </IconButtonStyles>
  );
}

ActionButton.propTypes = {
  type: PropTypes.string.isRequired,
  cb: PropTypes.func.isRequired,
  label: PropTypes.string,
};
