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
  HelpCircle,
  Eye,
  Search,
  Download,
  Play,
  Repeat,
  Pause,
  Square,
  PlusCircle,
  MinusCircle,
  CreditCard,
  Volume2,
  VolumeX,
  Volume,
  Clock,
} from 'react-feather';
import styled from 'styled-components';

export const IconButtonStyles = styled.a.attrs((props) => ({
  color: props.color || 'var(--blue)',
  hoverColor: props.hoverColor || 'var(--pink)',
}))`
  display: flex;
  align-items: center;
  margin: 0;
  height: 100%;
  background-color: transparent;
  border: transparent none;
  color: ${(props) => props.color};
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

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
      {type === 'help' && <HelpCircle size={size} />}
      {type === 'view' && <Eye size={size} />}
      {type === 'search' && <Search size={size} />}
      {type === 'download' && <Download size={size} />}
      {type === 'play' && <Play size={size} />}
      {type === 'pause' && <Pause size={size} />}
      {type === 'stop' && <Square size={size} />}
      {type === 'plus-circle' && <PlusCircle size={size} />}
      {type === 'minus-circle' && <MinusCircle size={size} />}
      {type === 'credit-card' && <CreditCard size={size} />}
      {(type === 'clone' || type === 'repeat') && <Repeat size={size} />}
      {type === 'signal' && <Volume size={size} />}
      {type === 'add-license' && <Volume2 size={size} />}
      {type === 'delete-signal' && <VolumeX size={size} />}
      {type === 'extend' && <Clock size={size} />}
    </IconButtonStyles>
  );
}

ActionButton.propTypes = {
  type: PropTypes.oneOf([
    'edit',
    'check',
    'copy',
    'delete',
    'close',
    'date',
    'back',
    'trash',
    'plus',
    'help',
    'view',
    'search',
    'download',
    'play',
    'pause',
    'stop',
    'clone',
    'repeat',
    'plus-circle',
    'minus-circle',
    'credit-card',
    'add-license',
    'delete-signal',
    'signal',
    'extend',
  ]).isRequired,
  cb: PropTypes.func.isRequired,
  label: PropTypes.string,
  size: PropTypes.number,
};
