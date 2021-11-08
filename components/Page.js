import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { ToastProvider } from 'react-toast-notifications';
import styled, { createGlobalStyle, css, ThemeProvider } from 'styled-components';
import theme from 'styled-theming';

import Header from './Header';
import Nav from './Nav';
import { UPDATE_THEME, useUser } from './User/Queries';

function Page({ children }) {
  const { user } = useUser();
  const [darkTheme, setDarkTheme] = useState(false);
  const [updateTheme] = useMutation(UPDATE_THEME);
  const [toggleMenu, setToggleMenu] = useState(false);

  useEffect(() => {
    setDarkTheme(user.theme === 'dark');
  }, [user]);

  function handleChangeTheme(dkTheme) {
    setDarkTheme(dkTheme);
    updateTheme({
      variables: { userId: user.id, theme: dkTheme ? 'dark' : 'light' },
    });
  }

  return (
    <ThemeProvider theme={{ mode: darkTheme ? 'dark' : 'light' }}>
      <ToastProvider>
        <MainScreen toggled={toggleMenu}>
          <GlobalStyles />
          <Header
            darkTheme={darkTheme}
            setDarkTheme={handleChangeTheme}
            menuState={toggleMenu}
            onClickMenu={() => setToggleMenu((prev) => !prev)}
          />
          <Nav toggled={toggleMenu} />
          <InnerStyles>{children}</InnerStyles>
        </MainScreen>
      </ToastProvider>
    </ThemeProvider>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};

export default Page;

const colors = theme('mode', {
  light: css`
    --green: #20c05c;
    --primary: #3c64a4;
    --secondary: #e63586;
    --black: #101010;
    --light-black: #282828;
    --grey: #3a3a3a;
    --light-grey: #e1e1e1;
    --off-white: #ededed;
    --background-light: #f0f0f0;
    --delete-color: #f22;
    --delete-color-hover: #f66;
    --update-color: #262;
    --update-color-hover: #292;
    --cancel-color: #e1e1e1;
    --cancel-color-hover: #828282;
    --background: #fff;
    --text-color: #111;
    --bs: 0 12px 24px 0 rgba(0, 0, 0, 0.09);
    --bs-card: 0 0 5px 3px rgba(0, 0, 0, 0.05);
    --bg-card: rgba(0, 0, 0, 0.02);
    --bs-drawer: 1px 0px 7px rgba(0, 0, 0, 0.5);
    --drop-shadow: 0 0 5px #000;
  `,
  dark: css`
    --green: #20c05c;
    --primary: #3c64a4;
    --secondary: #e63586;
    --black: #101010;
    --light-black: #282828;
    --grey: #3a3a3a;
    --grey: var(--grey);
    --light-grey: #919191;
    --off-white: #2d2d2d;
    --background-light: #3e3e3e;
    --delete-color: #f22;
    --delete-color-hover: #f66;
    --update-color: #262;
    --update-color-hover: #292;
    --cancel-color: #929292;
    --cancel-color-hover: #626262;
    --background: #222;
    --text-color: #ccc;
    --bs: 0 12px 24px 0 rgba(255, 255, 255, 0.09);
    --bs-card: 0 0 5px 3px rgba(255, 255, 255, 0.05);
    --bg-card: rgba(255, 255, 255, 0.02);
    --bs-drawer: 1px 0px 7px rgba(255, 255, 255, 0.5);
    --drop-shadow: 0 0 5px #fff;
  `,
});

const GlobalStyles = createGlobalStyle`
  :root {
    ${colors}
    --break-menu: 1000px;
    --break-form: 1000px;
  }

  html {

    box-sizing: border-box;
    font-size: 16px;
  }
  *, *:before, *:after {
    box-sizing: border-box;
  }
  body {
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    padding: 0;
    margin: 0;
    font-size: 1rem;
    line-height:2;
    min-height: 100%;
    background-color: var(--background);
    color: var(--text-color);
  }
  input, textarea, select {
    font-family: --apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  a {
    text-decoration: none;
    color: var(--primary);
    transition: transform 300ms ease-in-out;
  }
  button {
    color: var(--text-color);
  }
  input, textarea {
    background-color: var(--background);
    color: var(--text-color);
  }
`;

const InnerStyles = styled.div`
  grid-area: content;
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 2rem;
  align-self: stretch;
`;

const MainScreen = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 96px 1fr;
  grid-template-areas:
    'header header'
    'menu content';
  min-height: 100vh;
  width: 100%;
  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
    grid-template-rows: ${(props) => (props.toggled ? 'auto' : '96px')} auto 1fr;
    grid-template-areas:
      'header'
      'menu'
      'content';
  }
`;
