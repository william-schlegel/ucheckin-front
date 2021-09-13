/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable react/button-has-type */
import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';

import { DashboardCard } from './styles/Card';

export default function Dashboard({ title, total, count, children }) {
  const [toggle, setToggle] = useState(false);
  return (
    <DashboardCard>
      <HeaderStyle toggle={toggle} onClick={() => setToggle((prev) => !prev)}>
        {toggle ? (
          <h2>{title}</h2>
        ) : (
          <Total>
            {total}
            <span>{count}</span>
          </Total>
        )}
        <HeaderButton toggle={toggle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </HeaderButton>
      </HeaderStyle>
      {toggle && children}
    </DashboardCard>
  );
}

const HeaderStyle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  margin-bottom: ${(props) => (props.toggle ? '1em' : 0)};
  h2 {
    margin-bottom: 0;
  }
`;

const HeaderButton = styled.div`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  margin-left: 0.5em;
  svg {
    width: 2rem;
    height: 2rem;
    color: var(--secondary);
    transform: rotate(${(props) => (props.toggle ? '180deg' : '0deg')});
    transition: transform 200ms;
  }
`;

const Total = styled.h2`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  span {
    line-height: 1;
    font-size: 2em;
    color: var(--primary);
    border: 1px solid var(--primary);
    width: 1.5em;
    height: 1.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2em;
    text-align: center;
  }
`;

Dashboard.propTypes = {
  title: PropTypes.string,
  total: PropTypes.string,
  count: PropTypes.number,
  children: PropTypes.node,
};
