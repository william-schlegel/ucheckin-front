import styled from 'styled-components';

export const ButtonStyled = styled.button`
  --color: var(--primary);
  --hover-color: var(--secondary);
  --bg-color: transparent;
  --bg-hover-color: transparent;
  font-size: 1rem;
  background: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  margin: 0;
  /* margin-right: 1rem; */
  display: flex;
  gap: 1rem;
  border: solid 1px var(--color);
  color: var(--color);
  background-color: var(--bg-color);
  transition: background-color 200ms ease;
  & > * {
    color: var(--color) !important;
  }
  display: flex;
  align-items: center;
  white-space: nowrap;
  &:hover {
    background-color: var(--bg-hover-color);
    color: var(--hover-color);
    border-color: var(--hover-color);
    & > * {
      color: var(--hover-color) !important;
    }
    cursor: pointer;
  }
  :disabled,
  [aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const DeleteButtonStyled = styled(ButtonStyled)`
  --hover-color: yellow;
  --color: white;
  --bg-hover-color: var(--delete-color-hover);
  --bg-color: var(--delete-color);
`;

export const CancelButtonStyled = styled(ButtonStyled)`
  --hover-color: var(--lightBlack);
  --color: var(--black);
  --bg-hover-color: var(--cancel-color-hover);
  --bg-color: var(--cancel-color);
`;

export const ValidationButtonStyled = styled(ButtonStyled)`
  --hover-color: white;
  --color: white;
  --bg-hover-color: var(--update-color-hover);
  --bg-color: var(--update-color);
`;

export const PrimaryButtonStyled = styled(ButtonStyled)`
  --hover-color: white;
  --color: white;
  --bg-hover-color: var(--secondary);
  --bg-color: var(--primary);
`;

export const SecondaryButtonStyled = styled(ButtonStyled)`
  --hover-color: white;
  --color: white;
  --bg-hover-color: var(--primary);
  --bg-color: var(--secondary);
`;

export const NewButtonStyledBlock = styled(PrimaryButtonStyled)`
  width: 100%;
`;

export const NewButtonStyledBlockSecondary = styled(SecondaryButtonStyled)`
  width: 100%;
`;
