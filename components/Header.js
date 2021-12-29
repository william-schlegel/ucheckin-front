/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import Flag from 'react-country-flag';
import { Menu, Moon, Sun, User } from 'react-feather';
import styled from 'styled-components';

import useOnboarding from '../lib/useOnboarding';
import useOnClickOutside from '../lib/useOnClickOutside';
import ActionButton from './Buttons/ActionButton';
import { Help, HelpButton, useHelp } from './Help';
import { useUser } from './User/Queries';
import Signout from './User/SignOut';

const Flags = [
  { country: 'FR', lng: 'fr' },
  { country: 'US', lng: 'en' },
];

export default function Header({ darkTheme, setDarkTheme, menuState, onClickMenu }) {
  const [flag, setFlag] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const refMenu = useRef();
  const { t } = useTranslation('navigation');
  const router = useRouter();
  const { user } = useUser();
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('main');

  const ob = ['toggle-help', 'toggle-theme', 'toggle-language', 'my-profile'];
  if (user.canSeeAppMenu)
    ob.push(
      'menu-sdk',
      'menu-application',
      'menu-licenses',
      'menu-signals',
      'menu-invoices',
      'menu-notifications'
    );
  if (user.canSeeUcheckinMenu) ob.push('menu-events');
  if (user.canSeeUmitMenu) ob.push('menu-umit');
  const { Overlay, Highligh, start } = useOnboarding(ob);
  const {
    Overlay: OverlayFA,
    Highligh: HighlighFA,
    start: startFA,
  } = useOnboarding(['first-help']);

  useEffect(() => {
    const visited = localStorage.getItem('visited');
    if (!visited) {
      setTimeout(() => startFA(), 1000);
      localStorage.setItem('visited', new Date().toISOString());
    }
  });

  const toggleTheme = useCallback(() => {
    setDarkTheme(!darkTheme);
  }, [darkTheme, setDarkTheme]);

  const toggleFlag = useCallback(() => {
    let newFlag = flag + 1;
    if (newFlag >= Flags.length) newFlag = 0;
    setFlag(newFlag);
    setLanguage(Flags[newFlag].lng);
  }, [flag]);

  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(!showUserMenu);
  }, [showUserMenu]);

  function showMyProfile() {
    router.push({
      pathname: `/user/[id]`,
      query: {
        id: user.id,
      },
    });
  }
  function showMyAccount() {
    router.push({
      pathname: `/account/[id]`,
      query: {
        id: user.id,
      },
    });
  }
  function showSettings() {
    router.push({
      pathname: `/settings/[id]`,
      query: {
        id: user.id,
      },
    });
  }

  useOnClickOutside(refMenu, () => setShowUserMenu(false));

  return (
    <>
      <Overlay />
      <Highligh />
      <OverlayFA />
      <HighlighFA />
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <HeaderStyles menuState={menuState}>
        <div className="bar">
          <Logo>
            <span className="nav-toggle">
              <Menu size={48} onClick={onClickMenu} />
            </span>
            <img src="/images/UCHECKIN.png" alt="logo" />
            <Link href="/">Ucheck In</Link>
          </Logo>
          <div className="sub-bar">
            <ActionButton type="book" label={t('tutoriel')} cb={start} id="first-help" />
            <HelpButton showHelp={toggleHelpVisibility} id="toggle-help" />
            <button type="button" onClick={toggleTheme} id="toggle-theme">
              {darkTheme ? <Sun /> : <Moon />}
            </button>
            <button type="button" onClick={toggleFlag} id="toggle-language">
              <Flag
                svg
                countryCode={Flags[flag].country}
                style={{ fontSize: '2em', lineHeight: '2em' }}
                aria-label="France"
              />
            </button>
            {user?.id && (
              <>
                <button
                  type="button"
                  className="button-label"
                  onClick={toggleUserMenu}
                  id="my-profile"
                >
                  {user?.photo?.publicUrlTransformed ? (
                    <img className="avatar" src={user.photo.publicUrlTransformed} alt={user.name} />
                  ) : (
                    <User />
                  )}
                  <span>{user.name}</span>
                </button>
                {showUserMenu && (
                  <div ref={refMenu} className="user-menu">
                    <button type="button" onClick={showMyProfile}>
                      {t('profile')}
                    </button>
                    <button type="button" onClick={showMyAccount}>
                      {t('account')}
                    </button>
                    <button type="button" onClick={showSettings}>
                      {t('settings')}
                    </button>
                    <Signout />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </HeaderStyles>
    </>
  );
}

Header.propTypes = {
  darkTheme: PropTypes.bool,
  setDarkTheme: PropTypes.func,
  onClickMenu: PropTypes.func.isRequired,
  menuState: PropTypes.bool,
};

const Logo = styled.h1`
  font-size: 3rem;
  margin: 0;
  position: relative;
  z-index: 2;
  background: var(--green);
  display: flex;
  align-items: center;
  padding: 0 2rem;
  gap: 1rem;
  a {
    color: white;
    text-transform: uppercase;
  }
  img {
    height: 70px;
    width: auto;
  }
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const HeaderStyles = styled.header`
  grid-area: header;
  width: 100%;
  .nav-toggle {
    display: none;
  }
  @media (max-width: 1000px) {
    .nav-toggle {
      color: white;
      display: inline-block;
    }
  }
  .bar {
    border-bottom: 1px solid var(--green);
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    @media (max-width: 1000px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      border: none;
    }
  }

  .sub-bar {
    display: flex;
    justify-content: flex-end;
    align-items: stretch;
    .button-label,
    button,
    a {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      font-size: 0.8rem;
      margin: 3px 0.5rem;
      padding: 0 1rem;
      background-color: transparent;
      border-radius: 5px;
      border: transparent none;
      transition: background-color 300ms ease-in-out;
    }
    button {
      &:hover {
        background-color: var(--secondary);
      }
      &:focus {
        border: none;
        outline: none;
      }
    }
    img.avatar {
      width: 50px;
      height: 50px;
      border-radius: 50px;
      margin-top: 5px;
    }
    .user-menu {
      position: absolute;
      right: 0;
      top: 90px;
      border: var(--secondary) solid 1px;
      background-color: var(--background);
      border-radius: 3px;
      list-style: none;
      margin: 0.25rem;
      padding: 0;
      justify-content: start;
      transition: background-color 300ms ease-in-out;
      button {
        color: var(--primary);
        font-size: 1rem;
        display: block;
        width: 100%;
        padding: 0.5rem 2rem;
        align-items: start;
        white-space: nowrap;
        font-weight: 900;
        margin: 0;
        border-radius: 0;
        cursor: pointer;
        &:hover {
          background-color: var(--secondary);
          color: white;
        }
      }
    }
    @media (max-width: 1000px) {
      justify-content: flex-start;
      align-items: stretch;
      justify-content: space-evenly;
      display: ${(props) => (props.menuState ? 'flex' : 'none')};
    }
  }
`;
