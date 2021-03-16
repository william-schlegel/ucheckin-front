import styled from 'styled-components';

export const Wrapper = styled.div`
  position: fixed;
  z-index: 4002;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  left: 0;
  top: 0;
  padding: 10px;
  color: #1e1e1e;
  border-radius: 25px;
  background: transparent;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .overlay {
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    position: fixed;
    z-index: 0;
    background: rgba(38, 192, 211, 0.2);
    .content {
      max-width: 80vh;
      max-height: 80vh;
      background-color: var(--background);
      opacity: 1;
      border: 1px solid rgba(0, 0, 0, 0.03);
      filter: drop-shadow(0 0 5px rgba(0, 0, 0, 0.05));
      border-radius: 5px;
      position: absolute;
      top: 20%;
      left: 50%;
      right: auto;
      bottom: auto;
      margin-right: -50%;
      transform: translate(-50%, -50%);
      z-index: 1001;
      padding: 0.5rem 2rem;
      .header {
        border-bottom: 1px solid var(--lightGray);
        margin-bottom: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        h2 {
          display: inline;
          color: var(--blue);
        }
        a {
          margin-left: 2rem;
          border-left: 1px solid var(--lightGray);
          padding-left: 0.5rem;
        }
      }
      .body {
        a {
          padding: 0 1rem;
          margin: 0 1rem;
          border: 1px solid var(--blue);
          text-decoration: none;
          &:hover {
            color: var(--pink);
            border: 1px solid var(--pink);
          }
        }
      }
      .footer {
        border-top: 1px solid var(--lightGray);
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        padding-top: 0.5rem;
        display: flex;
        justify-content: flex-end;
      }
    }
  }
`;
