import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Code,
  Cpu,
  DollarSign,
  Minimize2,
  Printer,
  Speaker,
  Users,
  Volume2,
} from 'react-feather';
import styled from 'styled-components';

import Footer from './Footer';
import { useUser } from './User/Queries';
import SignOut from './User/SignOut';

const SZ_ICON = [16, 24];
const MENUS = [
  { menu: 'app', label: 'sdk', route: '/sdk', icon: (sz) => <Code size={sz} /> },
  {
    menu: 'app',
    label: 'applications',
    route: '/applications',
    icon: (sz) => <Cpu size={sz} />,
  },
  { menu: 'app', label: 'licenses', route: '/licenses', icon: (sz) => <Activity size={sz} /> },
  { menu: 'app', label: 'signals', route: '/signals', icon: (sz) => <Volume2 size={sz} /> },
  { menu: 'price', label: 'prices', route: '/prices', icon: (sz) => <DollarSign size={sz} /> },
  {
    menu: 'app',
    label: 'notifications',
    route: '/notifications',
    icon: (sz) => <AlertTriangle size={sz} />,
  },
  { menu: 'invoice', label: 'invoices', route: '/invoices', icon: (sz) => <Printer size={sz} /> },
  { menu: 'user', label: 'users', route: '/users', icon: (sz) => <Users size={sz} /> },
  { menu: 'event', label: 'events', route: '/events', icon: (sz) => <Speaker size={sz} /> },
  {
    menu: 'umit',
    label: 'umit',
    sub: [
      { route: '/umit/measures', label: 'measures' },
      { route: '/umit/sensors', label: 'sensors' },
      { route: '/umit/locations', label: 'locations' },
      { route: '/umit/materials', label: 'materials' },
    ],
    icon: (sz) => <Minimize2 size={sz} />,
  },
];

export default function Nav({ toggled, reduced, setReduced }) {
  const { user } = useUser();
  const { t } = useTranslation('navigation');

  if (!user?.id) return <div>&nbsp;</div>;

  const menuOk = {
    app: user.canSeeAppMenu,
    price: user.role?.canManagePrice,
    user: user.role?.canSeeOtherUsers || user.role?.canManageUsers,
    event: user.canSeeUcheckinMenu,
    umit: user.canSeeUmitMenu,
    invoice: user.role?.canSeeOrder,
  };

  return (
    <NavStyles className="menu" toggled={toggled} reduced={reduced}>
      <BtnReduce onClick={() => setReduced((prev) => !prev)} reduced={reduced}>
        <ArrowLeft size={SZ_ICON[0]} />
      </BtnReduce>
      <ul>
        {MENUS.map(
          (m) =>
            menuOk[m.menu] &&
            (m.sub ? (
              <SubMenu
                key={m.label}
                label={reduced ? '' : t(m.label)}
                id={`menu-${m.label}`}
                icon={m.icon(SZ_ICON[reduced ? 1 : 0])}
                reduced={reduced}
              >
                <ul>
                  {m.sub.map((s) => (
                    <li key={s.label} className="sub-item">
                      <Link href={s.route}>{t(s.label)}</Link>
                    </li>
                  ))}
                </ul>
              </SubMenu>
            ) : (
              <li key={m.label} id={`menu-${m.label}`}>
                <Link href={m.route}>
                  <a>
                    {m.icon(SZ_ICON[reduced ? 1 : 0])}
                    {!reduced && t(m.label)}
                  </a>
                </Link>
              </li>
            ))
        )}
        <li className="bottom">
          <div>
            <SignOut reduced={reduced} />
            {!reduced && <Footer />}
          </div>
        </li>
      </ul>
    </NavStyles>
  );
}

function SubMenu({ label, children, id, icon, reduced }) {
  const [toggle, setToggle] = useState(false);

  function handleClick() {
    setToggle((prev) => !prev);
  }

  return (
    <li id={id}>
      <button className="sub-menu" onKeyPress={handleClick} onClick={handleClick}>
        <div className="label">
          {icon}
          {label}
        </div>
        <HeaderButton toggle={toggle}>
          {reduced ? <ChevronRight size={24} /> : <ChevronDown size={24} />}
        </HeaderButton>
      </button>
      {toggle && children}
    </li>
  );
}

Nav.propTypes = {
  toggled: PropTypes.bool,
};

const BtnReduce = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px 0;
  transform: rotate(${(props) => (props.reduced ? '180deg' : '0deg')});
  transition: transform 200ms;
  &:hover,
  &:focus {
    background-color: var(--secondary);
  }
  color: white;
`;

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
  position: relative;
  padding: 0;
  grid-area: menu;
  width: 100%;
  margin: 0;
  font-size: 1.25rem;
  border-right: var(--light-grey) solid 1px;
  background-color: var(--primary);
  display: block;
  /* max-width: fit-content; */
  ul {
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    a,
    button {
      color: white;
      font-size: 1.1rem;
      padding: 1rem 2rem;
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
      position: relative;
      a,
      .label {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      &.bottom {
        border-top: var(--light-grey) solid 1px;
        /* outline: var(--light-grey) solid 1px; */
        padding: 1rem 0;
        margin-top: auto;
        padding-bottom: 0;
        position: absolute;
        bottom: 0;
        width: 100%;
      }
      ${(props) =>
        props.reduced
          ? `
      ul {
        position: absolute;
        left: 100px;
        top: 0;
        height: auto;
        z-index: 100;
        background-color: var(--primary);
        border: solid 1px white;
        border-radius: 5px;
      }
      `
          : ''}
      &.sub-item {
        padding-left: ${(props) => (props.reduced ? '0' : '1em')};
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
  @media (max-width: var(--break-menu)) {
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
