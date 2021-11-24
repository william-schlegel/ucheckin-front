import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';

import Footer from './Footer';
import { useUser } from './User/Queries';
import SignOut from './User/SignOut';

export default function Nav({ toggled }) {
  const { user } = useUser();
  const { t } = useTranslation('navigation');
  if (user?.id)
    return (
      <NavStyles className="menu" toggled={toggled}>
        <ul>
          {user.canSeeAppMenu && (
            <>
              <li>
                <Link href="/sdk">{t('sdk')}</Link>
              </li>
              <li>
                <Link href="/applications">{t('applications')}</Link>
              </li>
              <li>
                <Link href="/licenses">{t('licenses')}</Link>
              </li>
              <li>
                <Link href="/signals">{t('signals')}</Link>
              </li>
              {user.role?.canManagePrice && (
                <li>
                  <Link href="/prices">{t('prices')}</Link>
                </li>
              )}
              <li>
                <Link href="/invoices">{t('invoices')}</Link>
              </li>
              {(user.role?.canSeeOtherUsers || user.role?.canManageUsers) && (
                <li>
                  <Link href="/users">{t('users')}</Link>
                </li>
              )}
              <li>
                <Link href="/notifications">{t('notifications')}</Link>
              </li>
            </>
          )}
          {user.canSeeUcheckinMenu && (
            <li>
              <Link href="/events">{t('events')}</Link>
            </li>
          )}
          {user.canSeeUmitMenu && (
            <SubMenu label={t('umit')}>
              <ul>
                <li className="sub-item">
                  <Link href="/umit/measures">{t('measures')}</Link>
                </li>
                <li className="sub-item">
                  <Link href="/umit/sensors">{t('sensors')}</Link>
                </li>
                <li className="sub-item">
                  <Link href="/umit/locations">{t('locations')}</Link>
                </li>
                <li className="sub-item">
                  <Link href="/umit/materials">{t('materials')}</Link>
                </li>
              </ul>
            </SubMenu>
            // <li>
            //   <Link href="/umit">{t('umit')}</Link>
            // </li>
          )}
          <li className="bottom">
            <div>
              <SignOut />
              <Footer />
            </div>
          </li>
        </ul>
      </NavStyles>
    );
  return null;
}

function SubMenu({ label, children }) {
  const [toggle, setToggle] = useState(false);

  function handleClick() {
    setToggle((prev) => !prev);
  }

  return (
    <li>
      <button className="sub-menu" onKeyPress={handleClick} onClick={handleClick}>
        {label}
        <HeaderButton toggle={toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </HeaderButton>
      </button>
      {toggle && children}
    </li>
  );
}

Nav.propTypes = {
  toggled: PropTypes.bool,
};

const HeaderButton = styled.li`
  width: 1em;
  height: 1em;
  cursor: pointer;
  margin-left: 0.5em;
  svg {
    width: 1em;
    height: 1em;
    color: white;
    transform: rotate(${(props) => (props.toggle ? '180deg' : '0deg')});
    transition: transform 200ms;
  }
`;

const NavStyles = styled.nav`
  grid-area: menu;
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
  border-right: var(--light-grey) solid 1px;
  background-color: var(--primary);
  display: block;
  /* max-width: fit-content; */
  ul {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    padding: 0;
    margin: 0;
    a,
    button {
      color: white;
      font-size: 1.1rem;
      padding: 1rem 3rem;
      width: 100%;
      display: flex;
      align-items: flex-start;
      position: relative;
      font-weight: 700;
      background: none;
      border: 0;
      white-space: nowrap;
      cursor: pointer;
      background-color: transparent;
      border-bottom-right-radius: 5px;
      border-top-right-radius: 5px;
      transition: background-color 300ms ease-in-out;
      &:hover,
      &:focus {
        background-color: var(--secondary);
      }
      &.sub-menu {
        width: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
    li {
      list-style: none;
      &.bottom {
        border-top: var(--light-grey) solid 1px;
        /* outline: var(--light-grey) solid 1px; */
        padding: 1rem 0;
        margin-top: auto;
        padding-bottom: 0;
      }
      &.sub-item {
        padding-left: 1em;
        a,
        button {
          font-size: 0.8em;
          font-weight: 500;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          word-wrap: break-word;
        }
      }
    }
  }
  @media (max-width: 1000px) {
    width: 100%;
    padding: 0;
    margin: 0;
    display: ${(props) => (props.toggled ? 'block' : 'none')};
    ul {
      margin: 0;
      padding: 0;
      li {
        a,
        button {
          justify-content: center !important;
          text-align: center;
          text-transform: uppercase;
          width: 100%;
          font-size: 1.5em;
          padding: 0.5rem 0;
        }
        &:last-child {
          border: none;
          padding: 0;
        }
      }
    }
    footer {
      display: none;
    }
  }
`;
