import PropTypes from 'prop-types';
import React, { useState } from 'react';
import styled from 'styled-components';
// import Switch from 'react-switch';

export default function Switch3S({ value, onChange, disabled }) {
  const [switchValue, setSwitchValue] = useState(value);

  function handleClick() {
    if (disabled) return;
    let newVal;
    switch (switchValue) {
      case 'unchecked':
        newVal = 'undefined';
        break;
      case 'undefined':
        newVal = 'checked';
        break;
      case 'checked':
        newVal = 'unchecked';
        break;
    }
    console.log(`newVal`, newVal);
    setSwitchValue(newVal);
    onChange(newVal);
  }
  // return <Switch checked={switchValue === 'checked'} onChange={handleClick} disabled={disabled} />;

  return (
    <Root disabled={disabled} onClick={handleClick}>
      <Background value={switchValue} disabled={disabled}>
        {switchValue === 'checked' && (
          <svg
            height="100%"
            width="100%"
            viewBox="-2 -5 17 21"
            style={{ position: 'absolute', top: 0, left: -12 }}
          >
            <path
              d="M11.264 0L5.26 6.004 2.103 2.847 0 4.95l5.26 5.26 8.108-8.107L11.264 0"
              fill="#fff"
              fillRule="evenodd"
            />
          </svg>
        )}
        {switchValue === 'unchecked' && (
          <svg
            viewBox="-2 -5 14 20"
            height="100%"
            width="100%"
            style={{ position: 'absolute', top: 0, right: -12 }}
          >
            <path
              d="M9.9 2.12L7.78 0 4.95 2.828 2.12 0 0 2.12l2.83 2.83L0 7.776 2.123 9.9 4.95 7.07 7.78 9.9 9.9 7.776 7.072 4.95 9.9 2.12"
              fill="#fff"
              fillRule="evenodd"
            />
          </svg>
        )}
        <Marker className={switchValue} />
      </Background>
    </Root>
  );
}

Switch3S.propTypes = {
  value: PropTypes.oneOf(['checked', 'undefined', 'unchecked']),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
};

const Root = styled.div`
  position: relative;
  display: inline-block;
  text-align: left;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  border-radius: 14px;
  transition: opacity 0.25s;
  user-select: none;
`;

const Background = styled.div`
  --bg-switch: ${(props) => {
    switch (props.value) {
      case 'checked':
        return '#080';
      case 'unchecked':
        return '#C00';
      default:
        return '#888';
    }
  }};
  height: 28px;
  width: 56px;
  margin: 0;
  position: relative;
  background: var(--bg-switch);
  border-radius: 14px;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  transition: background 0.25s;
`;

const Marker = styled.div`
  height: 28px;
  width: 28px;
  background: #fff;
  border: 1px solid var(--bg-switch);
  border-radius: 14px;
  position: absolute;
  pointer-events: none;
  top: 0;
  &.checked {
    right: 0;
  }
  &.undefined {
    left: 14px;
  }
  &.unchecked {
    left: 0;
  }
`;
