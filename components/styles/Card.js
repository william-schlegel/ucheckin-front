import styled, { keyframes } from 'styled-components';

export const Card = styled.div`
  box-shadow: var(--bs-card);
  background: var(--bg-card);
  border: 5px solid var(--offsetWhite);
  padding: 1rem;
  /* font-size: 1.5rem; */
  line-height: 1.5;
  font-weight: 600;
  /* margin-bottom: 0.5rem; */
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
`;

export const RowFull = styled(Row)`
  grid-column: 1 / span 2;
`;

export const RowReadOnly = styled(Row)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  height: fit-content;
  flex-grow: 0;
  /* margin-top: 0;
  margin-bottom: 0; */
  label {
    display: inline-block;
    width: auto;
    &:after {
      content: ':';
      margin: 0 1rem;
    }
  }
`;

export const Block = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin: 0;
  gap: 1rem;
`;

export const BlockShort = styled(Block)`
  width: auto;
`;

export const Label = styled.label`
  font-weight: 500;
  color: var(--primary);
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

export const LabelShort = styled(Label)`
  width: auto;
`;

export const Form = styled.form`
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  border: 5px solid var(--white);
  padding: 20px;
  /* font-size: 1.5rem; */
  line-height: 1.5;
  font-weight: 600;
  margin-bottom: 1rem;
`;

export const FormBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  @media (max-width: 1000px) {
    grid-template-columns: auto;
  }
  grid-gap: 0.5rem 1rem;
  .select {
    font-size: 1.25rem;
    width: 100%;
    z-index: 100;
  }
  input,
  textarea,
  select {
    padding: 0.5rem;
    font-size: 1.25rem;
    border: 1px solid var(--lightGray);
    width: 100%;
    &:focus {
      outline: 0;
      border-color: var(--primary);
    }
  }
  input[type='number'] {
    text-align: right;
  }
`;

export const Input = styled.input`
  padding: 0.5rem;
  font-size: 1.25rem;
  border: 1px solid var(--lightGray);
  width: 100%;
  &:focus {
    outline: 0;
    border-color: var(--primary);
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
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const FormHeader = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  border-bottom: 1px solid var(--lightGray);
  margin: 1rem 0;
  padding-bottom: 1rem;
  font-size: 1.5rem;
  color: var(--primary);
  justify-content: space-between;
`;

export const FormTitle = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 1rem;
  span {
    color: var(--secondary);
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
      var(--primary) 0%,
      var(--secondary) 50%,
      var(--primary) 100%
    );
    &[aria-busy='true']::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
`;

export const H1 = styled.h1`
  margin-block-start: 0.3rem;
  margin-block-end: 0.3rem;
  color: var(--secondary);
`;
export const H2 = styled.h2`
  margin-block-start: 0.25rem;
  margin-block-end: 0.25rem;
  color: var(--secondary);
`;

export const H3 = styled.h3`
  margin-block-start: 0.15rem;
  margin-block-end: 0.15rem;
  color: var(--secondary);
`;

export const H4 = styled.h4`
  color: var(--secondary);
`;

export const DashboardCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 2.5rem auto;
`;

export const Separator = styled.div`
  padding-top: 1rem;
  margin: 0.5rem 0;
  border-bottom: 1px solid var(--lightGray);
`;
