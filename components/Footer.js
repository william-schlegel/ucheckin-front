import styled from 'styled-components';

const FooterStyled = styled.footer`
  border-top: 1px solid var(--light-grey);
  text-align: center;
  color: var(--light-grey);
  margin-top: 1rem;
`;

export default function Footer() {
  return (
    <FooterStyled>&copy; Stimshop {new Date().getFullYear()}</FooterStyled>
  );
}
