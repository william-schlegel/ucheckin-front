import { useRef } from 'react';
import PropTypes from 'prop-types';

import DrawerStyled from './styles/Drawer';
import ActionButton from './Buttons/ActionButton';
import useOnClickOutside from '../lib/useOnClickOutside';

export default function Drawer({ open, onClose, children }) {
  const ref = useRef();
  useOnClickOutside(ref, () => onClose(null));

  return (
    <DrawerStyled ref={ref} className={open ? 'open' : ''}>
      <ActionButton type="close" cb={onClose} size={48} />
      {children}
    </DrawerStyled>
  );
}

Drawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};
