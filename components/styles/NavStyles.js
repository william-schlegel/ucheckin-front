import styled from 'styled-components';

const NavStyles = styled.ul`
  grid-area: 2 / 1 / 3 / 2;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  font-size: 1.25rem;
  border-right: var(--lightGray) solid 1px;
  a,
  button {
    padding: 1rem 3rem;
    display: flex;
    align-items: flex-start;
    position: relative;
    /* text-transform: uppercase; */
    font-weight: 900;
    /* font-size: 1em; */
    background: none;
    border: 0;
    white-space: nowrap;
    cursor: pointer;
    @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    }
    &:after {
      height: 2px;
      background: var(--pink);
      content: '';
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      transition: width 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      left: 50%;
      margin-top: 2rem;
    }
    &:hover,
    &:focus {
      outline: none;
      &:after {
        width: calc(100% - 60px);
      }
      @media (max-width: 700px) {
        width: calc(100% - 10px);
      }
    }
  }
  @media (max-width: 1300px) {
    border-top: 1px solid var(--lightGrey);
    width: 100%;
    /* justify-content: center; */
    /* font-size: 1.5rem; */
  }
`;

export default NavStyles;
