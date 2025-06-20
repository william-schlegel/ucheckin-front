import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import {
  BarChart,
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Edit,
  Eye,
  HelpCircle,
  Lock,
  MapPin,
  MinusCircle,
  Pause,
  Play,
  Plus,
  PlusCircle,
  Printer,
  Repeat,
  Search,
  Settings,
  Square,
  Trash,
  UserCheck,
  Volume,
  Volume2,
  VolumeX,
  X,
} from 'react-feather';
import styled from 'styled-components';

export const IconButtonStyles = styled.a.attrs((props) => ({
  color: props.color || 'var(--primary)',
  hoverColor: props.hoverColor || 'var(--secondary)',
}))`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0;
  height: 100%;
  background-color: transparent;
  border: transparent none;
  color: ${(props) => props.color};
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

export default function ActionButton({ type, cb = () => {}, label, size = 24, id }) {
  const { t } = useTranslation('common');
  return (
    <IconButtonStyles key={type} type="button" onClick={cb} title={label || t(type)} id={id}>
      {type === 'add-license' && <Volume2 size={size} />}
      {type === 'back' && <ChevronLeft size={size} />}
      {type === 'book' && <BookOpen size={size} />}
      {type === 'check' && <Check size={size} />}
      {(type === 'clone' || type === 'repeat') && <Repeat size={size} />}
      {type === 'copy' && <Copy size={size} />}
      {type === 'credit-card' && <CreditCard size={size} />}
      {type === 'date' && <Calendar size={size} />}
      {(type === 'delete' || type === 'close') && <X size={size} />}
      {type === 'delete-signal' && <VolumeX size={size} />}
      {type === 'download' && <Download size={size} />}
      {type === 'edit' && <Edit size={size} />}
      {type === 'extend' && <Clock size={size} />}
      {type === 'help' && <HelpCircle size={size} />}
      {type === 'minus-circle' && <MinusCircle size={size} />}
      {type === 'play' && <Play size={size} />}
      {type === 'plus-circle' && <PlusCircle size={size} />}
      {type === 'pause' && <Pause size={size} />}
      {type === 'plus' && <Plus size={size} />}
      {type === 'search' && <Search size={size} />}
      {type === 'signal' && <Volume size={size} />}
      {type === 'stop' && <Square size={size} />}
      {type === 'trash' && <Trash size={size} />}
      {(type === 'user-account' || type === 'dollar') && <DollarSign size={size} />}
      {type === 'user-profile' && <UserCheck size={size} />}
      {type === 'view' && <Eye size={size} />}
      {type === 'map-pin' && <MapPin size={size} />}
      {type === 'chart' && <BarChart size={size} />}
      {type === 'printer' && <Printer size={size} />}
      {type === 'settings' && <Settings size={size} />}
      {type === 'locked' && <Lock size={size} />}
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
    'book',
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
    'user-profile',
    'user-account',
    'dollar',
    'map-pin',
    'chart',
    'printer',
    'settings',
    'locked',
  ]).isRequired,
  cb: PropTypes.func.isRequired,
  label: PropTypes.string,
  size: PropTypes.number,
  id: PropTypes.string,
};
