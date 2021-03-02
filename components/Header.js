import { useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Sun, Moon, User } from 'react-feather';
import Flag from 'react-country-flag';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';

import useOnClickOutside from '../lib/useOnClickOutside';

const Logo = styled.h1`
  font-size: 3rem;
  margin: 0;
  position: relative;
  z-index: 2;
  background: var(--green);
  a {
    color: white;
    text-decoration: none;
    text-transform: uppercase;
    padding: 0.5rem 1rem;
  }
`;

const HeaderStyles = styled.header`
  grid-area: 1 / 1 / 2 / 3;
  .bar {
    border-bottom: 1px solid var(--green);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
  }

  .sub-bar {
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    button {
      margin: 3px 1rem;
      padding: 0 1rem;
      background-color: transparent;
      border: transparent none;
      &:hover {
        background-color: var(--pink);
      }
    }
    .user-menu {
      position: relative;
      ul {
        position: absolute;
        right: -1rem;
        top: 1.5rem;
        border: var(--gray) solid 1px;

        border-radius: 3px;
        list-style: none;
        margin: 0.25rem;
        padding: 0;
        li {
          font-size: 2rem;
          display: block;
          width: 100%;
          padding: 0.5rem 2rem;
          text-align: left;
          white-space: nowrap;
          &:hover {
            background-color: var(--pink);
          }
        }
      }
    }
  }
`;

const Flags = [
  { country: 'FR', lng: 'fr' },
  { country: 'US', lng: 'en' },
];

export default function Header() {
  const [darkTheme, setDarkTheme] = useState(false);
  const [flag, setFlag] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const refAvatar = useRef();
  const { t } = useTranslation('navigation');

  const toggleTheme = useCallback(() => {
    setDarkTheme(!darkTheme);
  }, [darkTheme]);

  const toggleFlag = useCallback(() => {
    let newFlag = flag + 1;
    if (newFlag >= Flags.length) newFlag = 0;
    setFlag(newFlag);
    setLanguage(Flags[newFlag].lng);
  }, [flag]);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(!showUserMenu);
  }, [showUserMenu]);

  useOnClickOutside(refAvatar, () => setShowUserMenu(false));

  return (
    <HeaderStyles>
      <div className="bar">
        <Logo>
          <Link href="/">Ucheck In</Link>
        </Logo>
        <div className="sub-bar">
          <button type="button" onClick={toggleTheme}>
            {darkTheme ? <Sun /> : <Moon />}
          </button>
          <button type="button" onClick={toggleFlag}>
            <Flag
              svg
              countryCode={Flags[flag].country}
              style={{ fontSize: '2em', lineHeight: '2em' }}
              aria-label="France"
            />
          </button>
          <button ref={refAvatar} type="button" onClick={toggleUserMenu}>
            <User />
            {showUserMenu && (
              <div className="user-menu">
                <ul>
                  <li>{t('profile')}</li>
                  <li>{t('signout')}</li>
                </ul>
              </div>
            )}
          </button>
        </div>
        {/* <Nav /> */}
      </div>
      {/* <div className="sub-bar">
        <Search />
      </div> */}
      {/* <Cart /> */}
    </HeaderStyles>
  );
}
