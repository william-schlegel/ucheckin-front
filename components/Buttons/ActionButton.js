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
} from 'react-feather';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

const IconButtonStyles = styled.a.attrs((props) => ({
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
  loading = false,
}) {
  const { t } = useTranslation('common');
  if (loading) return <ClipLoader loading color="#3c64a4" />;
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
      {(type === 'clone' || type === 'repeat') && <Repeat size={size} />}
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
  ]).isRequired,
  cb: PropTypes.func.isRequired,
  label: PropTypes.string,
  size: PropTypes.number,
  loading: PropTypes.bool,
};
