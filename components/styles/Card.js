import styled, { keyframes } from 'styled-components';

export const Card = styled.div`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid var(--white);
  padding: 20px;
  /* font-size: 1.5rem; */
  line-height: 1.5;
  font-weight: 600;
`;

export const Row = styled.div`
  display: block;
  align-items: center;
  margin: 0.5rem;
  display: flex;
  flex-direction: column;
`;

export const Block = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  & > * {
    margin: 0 1rem !important;
    &:first-child {
      margin-left: 0 !important;
    }
    &:last-child {
      margin-right: 0 !important;
    }
  }
`;

export const Label = styled.label`
  font-weight: 500;
  color: var(--blue);
  width: 100%;
  font-size: 1.25rem;
  &[required] {
    ::after {
      content: '*';
      margin-left: 0.5rem;
      color: var(--red, red);
    }
  }
`;

export const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid var(--white);
  padding: 20px;
  /* font-size: 1.5rem; */
  line-height: 1.5;
  font-weight: 600;
`;

export const FormBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 700px) {
    grid-template-columns: auto;
  }
  grid-gap: 0.25rem;
  input,
  textarea,
  select {
    padding: 0.5rem;
    font-size: 1.25rem;
    border: 1px solid var(--lightGray);
    width: 100%;
    &:focus {
      outline: 0;
      border-color: var(--blue);
    }
  }
`;

export const FormBodyFull = styled(FormBody)`
  grid-template-columns: auto;
`;

export const FormFooter = styled.div`
  display: flex;
  align-items: center;
  border-top: 1px solid var(--lightGray);
  margin: 1rem 0;
  padding-top: 1rem;
`;

export const FormHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: 1px solid var(--lightGray);
  margin: 1rem 0;
  padding-bottom: 1rem;
  font-size: 1.5rem;
  color: var(--blue);
  justify-content: space-between;
`;

export const FormTitle = styled.div`
  display: flex;
  align-items: center;
  span {
    margin-left: 1rem;
    margin-right: 1rem;
    color: var(--pink);
  }
`;

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

export const FormWithBar = styled(Form)`
  &::before {
    height: 10px;
    content: '';
    display: block;
    background-image: linear-gradient(
      to right,
      var(--blue) 0%,
      var(--pink) 50%,
      var(--blue) 100%
    );
    &[aria-busy='true']::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
`;
