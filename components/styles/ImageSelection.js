import styled from 'styled-components';

export const ImageSelection = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  .dropzone {
    padding: 1rem;
    text-align: center;
    border: 3px dashed var(--lightGray);
    border-radius: 10px;
  }
  img {
    max-width: 60%;
    max-height: 30vh;
    height: auto;
    width: auto;
    margin: 1rem auto;
    border: 1px solid var(--lightGray);
  }
`;
