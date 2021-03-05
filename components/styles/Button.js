import styled from 'styled-components';

export const ButtonStyled = styled.button`
  font-size: 1rem;
  background: none;
  border: 0;
  color: var(--blue);
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
  border-radius: 5px;
  padding: 1rem 3rem;
  margin: 0 1rem;
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
  border-radius: 5px;
  margin: 0 1rem;
  padding: 1rem 3rem;
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
  border-radius: 5px;
  padding: 1rem 3rem;
  margin: 0 1rem;
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
