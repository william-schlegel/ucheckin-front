import styled from 'styled-components';

const IconButtonStyles = styled.button.attrs((props) => ({
  color: props.color || 'var(--blue)',
  hoverColor: props.hoverColor || 'var(--pink)',
}))`
  margin: 0;
  height: 100%;
  background-color: transparent;
  border: transparent none;
  color: ${(props) => props.color};
  &:hover {
    color: ${(props) => props.hoverColor};
  }
`;

export default IconButtonStyles;
