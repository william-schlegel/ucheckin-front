import SwitchComponent from 'react-switch';
import styled from 'styled-components';
import PropTypes from 'prop-types';

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
