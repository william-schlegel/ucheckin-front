import PropTypes from 'prop-types';
import styled, {
  createGlobalStyle,
  css,
  ThemeProvider,
} from 'styled-components';
import { Notify, Report, Confirm } from 'notiflix';
import { useEffect, useState } from 'react';
import theme from 'styled-theming';

import { useMutation } from '@apollo/client';
import Header from './Header';
import Nav from './Nav';
import { UPDATE_THEME, useUser } from './User/Queries';

const colors = theme('mode', {
  light: css`
    --green: #20c05c;
    --primary: #3c64a4;
    --secondary: #e63586;
    --black: #101010;
    --lightBlack: #282828;
    --grey: #3a3a3a;
    --gray: var(--grey);
    --lightGrey: #e1e1e1;
    --lightGray: var(--lightGrey);
    --offWhite: #ededed;
    --background-light: #fefefe;
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
    --lightBlack: #282828;
    --grey: #3a3a3a;
    --gray: var(--grey);
    --lightGrey: #919191;
    --lightGray: var(--lightGrey);
    --offWhite: #2d2d2d;
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
  html {
    ${colors}
    --maxWidth: 80vw;
    --break-menu: 800px;

    box-sizing: border-box;
    font-size: 16px;
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
  a:hover {
    transform: scale(1.1);
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
  /* max-width: var(--maxWidth); */
  width: 100%;
  max-width: 1920px;
  margin: 0 auto;
  padding: 2rem;
  align-self: stretch;
`;

const MainScreen = styled.div`
  display: flex;
  flex-direction: column;
  /* flex: 1 1 100%; */
  min-height: 100vh;
`;

const Content = styled.div`
  flex: 1 0 auto;
  display: flex;
  flex-direction: row;
  /* height: 100%; */
`;

export default function Page({ children }) {
  useEffect(() => {
    Notify.Init({
      fontSize: '20px',
      messageMaxLength: 250,
      width: '50ch',
      borderRadius: '5px',
    });
    Report.Init({
      borderRadius: '5px',
    });
    Confirm.Init({
      borderRadius: '5px',
      width: '50ch',
    });
  });
  const { user } = useUser();
  const [darkTheme, setDarkTheme] = useState(false);
  const [updateTheme] = useMutation(UPDATE_THEME);

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
      <MainScreen>
        <GlobalStyles />
        <Header darkTheme={darkTheme} setDarkTheme={handleChangeTheme} />
        <Content>
          <Nav />
          <InnerStyles>{children}</InnerStyles>
        </Content>
      </MainScreen>
    </ThemeProvider>
  );
}

Page.propTypes = {
  children: PropTypes.any,
};
