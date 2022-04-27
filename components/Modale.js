import { Dialog } from '@headlessui/react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import CancelButton from './Buttons/ButtonCancel';

export default function Modale({ isOpen, onClose, title, children, actionButtons, cancelLabel }) {
  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onClose={onClose} style={DIALOG_STYLE}>
      <Dialog.Overlay style={OVERLAY_STYLE} />
      <MyModal>
        <Dialog.Title as="h3">{title}</Dialog.Title>
        {children}
        <div className="footer">
          {actionButtons}
          <CancelButton onClick={onClose} label={cancelLabel} />
        </div>
      </MyModal>
    </Dialog>
  );
}

Modale.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
  actionButtons: PropTypes.arrayOf(PropTypes.node),
};

const OVERLAY_STYLE = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
};

const DIALOG_STYLE = {
  position: 'fixed',
  inset: 0,
  overflowY: 'auto',
  display: 'grid',
  placeItems: 'center',
  zIndex: 10,
  maxWidth: '100%',
};

const MyModal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  max-width: 90vw;
  position: relative;
  .title {
    font-size: 1.5rem;
    font-weight: 800;
    margin-bottom: 1rem;
  }
  a {
    color: var(--primary);
    margin-inline-end: 1rem;
    &:last-child {
      margin-inline-end: 0;
    }
  }
  .footer {
    margin-block-start: 1rem;
    padding-block-start: 1rem;
    border-top: 1px solid var(--primary);
  }
  .deux-champs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.5rem;
    .champ {
      display: flex;
      flex-direction: column;
    }
  }
`;
