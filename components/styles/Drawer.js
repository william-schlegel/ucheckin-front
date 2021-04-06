import styled from 'styled-components';

const DrawerStyled = styled.div`
  height: 100%;
  background-color: var(--background);
  position: fixed;
  top: 0;
  right: 0;
  width: 40%;
  z-index: 201;
  box-shadow: 1px 0px 7px rgba(0, 0, 0, 0.5);
  transform: translateX(100%);
  transition: transform 500ms ease-in-out;
  &.open {
    transform: translateX(0);
  }
  overflow: auto;
`;

export const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--lightGray);
  padding: 0.5rem;
  margin-bottom: 1rem;
  h3 {
    display: inline;
    color: var(--secondary);
    font-weight: 500;
    font-size: 2rem;
    margin: 0;
    padding-left: 2rem;
  }
`;

export const DrawerFooter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid var(--lightGray);
  padding-top: 0.5rem;
  margin-top: 1rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const DrawerBody = styled.div`
  margin: 1rem;
`;

export default DrawerStyled;
