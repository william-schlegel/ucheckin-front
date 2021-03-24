import PropTypes from 'prop-types';
import styled, { createGlobalStyle } from 'styled-components';
import { Notify } from 'notiflix';
import { useEffect } from 'react';
import Header from './Header';
import Nav from './Nav';

const GlobalStyles = createGlobalStyle`
  html {
    --green: #20C05C;
    --blue: #3c64a4;
    --pink: #E63586;
    --black: #101010;
    --lightBlack: #282828;
    --grey: #3A3A3A;
    --gray: var(--grey);
    --lightGrey: #e1e1e1;
    --lightGray: var(--lightGrey);
    --offWhite: #ededed;
    --maxWidth: 80vw;
    --background: #fefefe;
    --bs: 0 12px 24px 0 rgba(0,0,0,0.09);
    --delete-color: #f22;
    --delete-color-hover: #f66;
    --update-color: #262;
    --update-color-hover: #292;
    --cancel-color: #e1e1e1;
    --cancel-color-hover: #828282;

    box-sizing: border-box;
    font-size: 15px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 0;
    margin: 0;
    font-size: 1rem;
    line-height:2;
  }
  input, textarea, select {
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  a {
    text-decoration: none;
    text-decoration-line: none;
    text-decoration-style: none;
    color: var(--blue);
  }
  a:hover {
    text-decoration: underline;
  }
`;

const InnerStyles = styled.div`
  /* max-width: var(--maxWidth); */
  width: 100%;
  max-width: 1920px;
  margin: 0 auto 0 0;
  padding: 2rem;
`;

const MainScreen = styled.div`
  height: 100vh;
`;

const Content = styled.div`
  display: flex;
`;

export default function Page({ children }) {
  useEffect(() => {
    Notify.Init({
      fontSize: '20px',
      messageMaxLength: 250,
      width: '50ch',
    });
  });

  return (
    <MainScreen>
      <GlobalStyles />
      <Header />
      <Content>
        <Nav />
        <InnerStyles>{children}</InnerStyles>
      </Content>
    </MainScreen>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
