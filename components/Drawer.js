import { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ActionButton from './Buttons/ActionButton';

export default function Drawer({ open, onClose, children, title }) {
  const ref = useRef();
  // useOnClickOutside(ref, () => {
  //   if (open) onClose(null);
  // });

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

const DrawerStyled = styled.div`
  height: 100%;
  background-color: var(--background);
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  z-index: 201;
  box-shadow: var(--bs-drawer);
  transform: translateX(100%);
  transition: transform 500ms ease-in-out;
  &.open {
    transform: translateX(0);
  }
  overflow: auto;
  @media (max-width: 1000px) {
    width: 95%;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--lightGray);
  padding: 0.5rem;
  margin-bottom: 1rem;
  h3 {
    display: inline;
    color: var(--secondary);
    font-weight: 500;
    font-size: 2rem;
    margin: 0;
    padding-left: 2rem;
  }
`;

export const DrawerFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid var(--lightGray);
  padding-top: 0.5rem;
  margin-top: 1rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const DrawerBody = styled.div`
  margin: 1rem;
`;
