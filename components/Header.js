import { useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Sun, Moon, User } from 'react-feather';
import Flag from 'react-country-flag';
import useTranslation from 'next-translate/useTranslation';
import setLanguage from 'next-translate/setLanguage';
import { useRouter } from 'next/dist/client/router';

import useOnClickOutside from '../lib/useOnClickOutside';
import Signout from './Registration/SignOut';
import { useUser } from './User';

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
`;

const HeaderStyles = styled.header`
  width: 100%;
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
    .button-label,
    button {
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
      &:hover {
        background-color: var(--secondary);
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
      border: var(--gray) solid 1px;
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
  const refMenu = useRef();
  const { t } = useTranslation('navigation');
  const router = useRouter();
  const user = useUser();

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

  useOnClickOutside(refMenu, () => setShowUserMenu(false));
  return (
    <HeaderStyles>
      <div className="bar">
        <Logo>
          <img src="/images/UCHECKIN.png" alt="logo" />
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
          {user?.id && (
            <>
              <button
                type="button"
                className="button-label"
                onClick={toggleUserMenu}
              >
                {user?.photo?.publicUrlTransformed ? (
                  <img
                    className="avatar"
                    src={user.photo.publicUrlTransformed}
                    alt={user.name}
                  />
                ) : (
                  <User />
                )}
                <span>{user.name}</span>
              </button>
              {showUserMenu && (
                <div ref={refMenu} className="user-menu">
                  <button type="button" onClick={() => router.push('/profile')}>
                    {t('profile')}
                  </button>
                  <button type="button" onClick={() => router.push('/compte')}>
                    {t('account')}
                  </button>
                  {(user.role.canManageOrder || user.role.canSeeOrder) && (
                    <button
                      type="button"
                      onClick={() => router.push('/orders')}
                    >
                      {t('orders')}
                    </button>
                  )}
                  <Signout />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
}
