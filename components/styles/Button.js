import styled from 'styled-components';

export const ButtonStyled = styled.button`
  font-size: 1rem;
  background: none;
  border: 0;
  color: var(--blue);
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0;
  margin-right: 1rem;
  & > * {
    color: var(--blue);
  }
  display: flex;
  align-items: center;
  &:hover {
    color: var(--pink);
    & > * {
      color: var(--pink);
    }
    cursor: pointer;
  }
`;

export const DeleteButtonStyled = styled(ButtonStyled)`
  background-color: #f22;
  border: solid 1px red;
  color: white;
  & > * {
    color: white !important;
  }
  &:hover {
    color: yellow;
    background-image: linear-gradient(to bottom, #f22 0%, #f22 90%, #f88 100%);
    & > * {
      color: yellow !important;
    }
  }
`;

export const CancelButtonStyled = styled(ButtonStyled)`
  background-color: var(--lightGray);
  border: solid 1px var(--gray);
  color: var(--black);
  & > * {
    color: var(--black) !important;
  }
  &:hover {
    background-image: linear-gradient(
      to bottom,
      var(--lightGray) 0%,
      var(--lightGray) 90%,
      var(--gray) 100%
    );
    color: var(--lightBlack);
    & > * {
      color: var(--lightBlack) !important;
    }
  }
`;

export const ValidationButtonStyled = styled(ButtonStyled)`
  background-color: #262;
  border: solid 1px #020;
  color: white;
  & > * {
    color: white !important;
  }
  &:hover {
    color: white;
    background-image: linear-gradient(to bottom, #262 0%, #262 90%, #4d4 100%);
    & > * {
      color: white !important;
    }
  }
`;

export const NewButtonStyled = styled(ButtonStyled)`
  background-color: var(--blue);
  color: white;
  transition: backgound-color 200ms ease;
  & > * {
    color: white !important;
  }
  &:hover {
    color: white !important;
    background-color: var(--pink);
  }
`;
