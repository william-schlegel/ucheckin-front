import { Dialog } from '@headlessui/react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styled from 'styled-components';

import ButtonCancel from '../components/Buttons/ButtonCancel';
import ButtonValidation from '../components/Buttons/ButtonValidation';

function useConfirm({ title, message, yesLabel, noLabel, callback = () => {} }) {
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
            <ReactMarkdown>{message}</ReactMarkdown>
            {/* {message.split('\n').map((m) => (
              <p key={m}>{m}</p>
            ))} */}
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
  z-index: 150;
`;

const DialogWrapper = styled.div`
  display: flex;
  flex-grow: 1;
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
  max-width: 50vh;
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-items: flex-end;
  width: 100%;
`;
