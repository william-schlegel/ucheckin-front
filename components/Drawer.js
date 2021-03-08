import { useRef } from 'react';
import PropTypes from 'prop-types';

import DrawerStyled, { DrawerBody, DrawerHeader } from './styles/Drawer';
import ActionButton from './Buttons/ActionButton';
import useOnClickOutside from '../lib/useOnClickOutside';

export default function Drawer({ open, onClose, children, title }) {
  const ref = useRef();
  useOnClickOutside(ref, () => onClose(null));

  return (
    <DrawerStyled ref={ref} className={open ? 'open' : ''}>
      <DrawerHeader>
        <h3>{title}</h3>
        <ActionButton type="close" cb={onClose} size={48} />
      </DrawerHeader>
      <DrawerBody>{children}</DrawerBody>
    </DrawerStyled>
  );
}

Drawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  title: PropTypes.string,
};
