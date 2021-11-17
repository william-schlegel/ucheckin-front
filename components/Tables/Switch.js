import PropTypes from 'prop-types';
import SwitchComponent from 'react-switch';
import styled from 'styled-components';

import Switch3S from '../Switch3States';

const SwitchContainer = styled.div`
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
`;

export default function Switch({ value, disabled, callBack }) {
  return (
    <SwitchContainer>
      <SwitchComponent
        onChange={() => typeof callBack === 'function' && callBack(value)}
        checked={!!value}
        disabled={disabled}
      />
    </SwitchContainer>
  );
}

Switch.propTypes = {
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  callBack: PropTypes.func,
};

export function Switch3States({ value = 'undefined', disabled, callBack }) {
  return (
    <SwitchContainer>
      <Switch3S
        onChange={(newVal) => typeof callBack === 'function' && callBack(newVal)}
        value={value}
        disabled={disabled}
      />
    </SwitchContainer>
  );
}

Switch3States.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  callBack: PropTypes.func,
};
