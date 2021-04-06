import styled from 'styled-components';

const FieldErrorStyled = styled.div`
  color: red;
  text-align: left;
  width: 100%;
`;

export default function FieldError({ error }) {
  if (!error) return null;
  return <FieldErrorStyled>{error}</FieldErrorStyled>;
}
