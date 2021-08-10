import PropTypes from 'prop-types';
import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import styled from 'styled-components';
import ButtonValidation from '../components/Buttons/ButtonValidation';
import ButtonCancel from '../components/Buttons/ButtonCancel';

function useConfirm({
  title,
  message,
  yesLabel,
  noLabel,
  callback = () => {},
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [args, setArgs] = useState(null);

  function Confirm({ cb = callback }) {
    if (!isOpen) return null;
    return (
      <StyledDialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogWrapper>
          <DialogOverlay />
          <ContentWrapper>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{message}</Dialog.Description>
            <Buttons>
              <ButtonValidation
                label={yesLabel}
                onClick={() => {
                  setIsOpen(false);
                  cb(args);
                }}
              />
              <ButtonCancel label={noLabel} onClick={() => setIsOpen(false)} />
            </Buttons>
          </ContentWrapper>
        </DialogWrapper>
      </StyledDialog>
    );
  }
  Confirm.propTypes = {
    cb: PropTypes.func,
  };

  return {
    Confirm,
    setIsOpen,
    setArgs,
  };
}

export default useConfirm;

const StyledDialog = styled(Dialog)`
  position: fixed;
  inset: 0;
  overflow-y: auto;
  color: var(--text-color);
`;

const DialogWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 151;
  min-height: 100vh;
`;

const DialogOverlay = styled(Dialog.Overlay)`
  position: fixed;
  inset: 0;
  background-color: #000;
  opacity: 0.3;
  z-index: 150;
`;

const ContentWrapper = styled.div`
  background-color: var(--background);
  z-index: 152;
  padding: 2rem 3rem;
  border-radius: 0.5rem;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-items: flex-end;
  width: 100%;
`;
