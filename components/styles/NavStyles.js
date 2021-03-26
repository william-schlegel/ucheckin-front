import styled from 'styled-components';

const NavStyles = styled.ul`
  margin: 0;
  padding: 0;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  font-size: 1.25rem;
  border-right: var(--lightGray) solid 1px;
  max-width: fit-content;
  li {
    list-style: none;
    &:last-child {
      border-top: var(--lightGray) solid 1px;
      /* outline: var(--lightGray) solid 1px; */
      padding: 1rem 0;
      margin-top: auto;
      padding-bottom: 0;
    }
  }
  background-color: var(--primary);
  a,
  button {
    color: white;
    font-size: 1.1rem;
    padding: 1rem 3rem;
    display: flex;
    align-items: flex-start;
    position: relative;
    font-weight: 700;
    background: none;
    border: 0;
    white-space: nowrap;
    cursor: pointer;
    background-color: transparent;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
    transition: background-color 300ms ease-in-out;
    &:hover,
    &:focus {
      background-color: var(--secondary);
    }
  }
  @media (max-width: var(--break-menu)) {
    display: none;
    width: 100%;
    padding: 5px;
    text-align: center;
  }
`;

export default NavStyles;
