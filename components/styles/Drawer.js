import styled from 'styled-components';

const DrawerStyled = styled.div`
  height: 100%;
  background-color: var(--background);
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  z-index: 200;
  box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
  &.open {
    transform: translateX(0);
  }
`;

export default DrawerStyled;
