import styled from 'styled-components';

const NavStyles = styled.nav`
  grid-area: menu;
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
  border-right: var(--light-grey) solid 1px;
  background-color: var(--primary);
  display: block;
  /* max-width: fit-content; */
  ul {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    padding: 0;
    margin: 0;
    li {
      list-style: none;
      &:last-child {
        border-top: var(--light-grey) solid 1px;
        /* outline: var(--light-grey) solid 1px; */
        padding: 1rem 0;
        margin-top: auto;
        padding-bottom: 0;
      }
    }
    a,
    button {
      color: white;
      font-size: 1.1rem;
      padding: 1rem 3rem;
      width: 100%;
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
  }
  @media (max-width: 1000px) {
    width: 100%;
    padding: 0;
    margin: 0;
    display: ${(props) => (props.toggled ? 'block' : 'none')};
    ul {
      margin: 0;
      padding: 0;
      li {
        a,
        button {
          justify-content: center !important;
          text-align: center;
          text-transform: uppercase;
          width: 100%;
          font-size: 1.5em;
          padding: 0.5rem 0;
        }
        &:last-child {
          border: none;
          padding: 0;
        }
      }
    }
    footer {
      display: none;
    }
  }
`;

export default NavStyles;
