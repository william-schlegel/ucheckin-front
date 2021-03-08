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
  Plus,
} from 'react-feather';
import IconButtonStyles from '../styles/IconButton';

export default function ActionButton({
  type,
  cb = () => {},
  label,
  size = 24,
}) {
  const { t } = useTranslation('common');
  return (
    <IconButtonStyles
      key={type}
      type="button"
      onClick={cb}
      title={label || t(type)}
    >
      {type === 'edit' && <Edit size={size} />}
      {type === 'check' && <Check size={size} />}
      {type === 'copy' && <Copy size={size} />}
      {(type === 'delete' || type === 'close') && <X size={size} />}
      {type === 'date' && <Calendar size={size} />}
      {type === 'back' && <ChevronLeft size={size} />}
      {type === 'trash' && <Trash size={size} />}
      {type === 'plus' && <Plus size={size} />}
    </IconButtonStyles>
  );
}

ActionButton.propTypes = {
  type: PropTypes.string.isRequired,
  cb: PropTypes.func.isRequired,
  label: PropTypes.string,
  size: PropTypes.number,
};
