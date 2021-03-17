import styled from 'styled-components';

export const ButtonStyled = styled.button`
  font-size: 1rem;
  background: none;
  border: solid 1px var(--blue);
  color: var(--blue);
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0;
  margin-right: 1rem;
  display: flex;
  gap: 1rem;
  transition: backgound-color 200ms ease;
  & > * {
    color: var(--blue);
  }
  display: flex;
  align-items: center;
  &:hover {
    color: var(--pink);
    border-color: var(--pink);
    & > * {
      color: var(--pink);
    }
    cursor: pointer;
  }
`;

export const DeleteButtonStyled = styled(ButtonStyled)`
  background-color: var(--delete-color);
  border: solid 1px red;
  color: white;
  & > * {
    color: white !important;
  }
  &:hover {
    color: yellow;
    border-color: red;
    background-color: var(--delete-color-hover);
    & > * {
      color: yellow !important;
    }
  }
`;

export const CancelButtonStyled = styled(ButtonStyled)`
  background-color: var(--cancel-color);
  border: solid 1px var(--gray);
  color: var(--black);
  & > * {
    color: var(--black) !important;
  }
  &:hover {
    background-color: var(--cancel-color-hover);
    border-color: var(--gray);
    color: var(--lightBlack);
    & > * {
      color: var(--lightBlack) !important;
    }
  }
`;

export const ValidationButtonStyled = styled(ButtonStyled)`
  background-color: var(--update-color);
  border: solid 1px green;
  color: white;
  & > * {
    color: white !important;
  }
  &:hover {
    color: white;
    background-color: var(--update-color-hover);
    border-color: green;
    & > * {
      color: white !important;
    }
  }
`;

export const NewButtonStyled = styled(ButtonStyled)`
  background-color: var(--blue);
  color: white;
  & > * {
    color: white !important;
  }
  &:hover {
    color: white !important;
    border-color: var(--pink);
    background-color: var(--pink);
  }
`;

export const NewButtonStyledBlock = styled(NewButtonStyled)`
  width: 100%;
`;
