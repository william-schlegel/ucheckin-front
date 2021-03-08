import PropTypes from 'prop-types';
import styled from 'styled-components';
import ActionButton from './Buttons/ActionButton';
import CancelButton from './Buttons/ButtonCancel';

const Modal = styled.div`
  max-width: 80vh;
  max-height: 80vh;
  background-color: var(--background);
  opacity: 1;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  position: absolute;
  top: 20%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  padding: 0.5rem 2rem;
  .header {
    border-bottom: 1px solid var(--lightGray);
    margin-bottom: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    h2 {
      display: inline;
      color: var(--blue);
    }
    a {
      margin-left: 2rem;
      border-left: 1px solid var(--lightGray);
      padding-left: 0.5rem;
    }
  }
  .footer {
    border-top: 1px solid var(--lightGray);
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    padding-top: 0.5rem;
    display: flex;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  opacity: 0.3;
  z-index: 1000;
`;

export default function Modale({
  isOpen,
  setIsOpen,
  title,
  children,
  actionButtons,
  cancelLabel,
}) {
  function handleClose() {
    setIsOpen(false);
  }
  if (!isOpen) return null;
  return (
    <>
      <Backdrop onClick={handleClose} />
      <Modal>
        <div className="header">
          <h2>{title}</h2>
          <ActionButton type="close" cb={handleClose} />
        </div>
        {children}
        <div className="footer">
          {actionButtons}
          <CancelButton onClick={handleClose} label={cancelLabel} />
        </div>
      </Modal>
    </>
  );
}

Modale.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  title: PropTypes.string,
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
  actionButtons: PropTypes.arrayOf(PropTypes.node),
};
