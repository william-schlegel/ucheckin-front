import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`;

const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid var(--white);
  padding: 20px;
  /* font-size: 1.5rem; */
  line-height: 1.5;
  font-weight: 600;
  label {
    display: block;
    margin-bottom: 1rem;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 1rem;
    /* font-size: 1.5rem; */
    border: 1px solid var(--light-grey);
    &:focus {
      outline: 0;
      border-color: var(--primary);
    }
  }
  button,
  input[type='submit'] {
    width: auto;
    background: var(--secondary);
    color: white;
    border: 0;
    /* font-size: 2rem; */
    font-weight: 600;
    padding: 0.5rem 1.2rem;
  }
  fieldset {
    border: 0;
    padding: 0;

    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      height: 10px;
      content: '';
      display: block;
      background-image: linear-gradient(
        to right,
        var(--primary) 0%,
        var(--secondary) 50%,
        var(--primary) 100%
      );
    }
    &[aria-busy='true']::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
`;

export const Flex = styled.div`
  display: flex;
  align-items: center;
`;

export default Form;
