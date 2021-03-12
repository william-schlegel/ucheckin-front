import SwitchComponent from 'react-switch';
import PropTypes from 'prop-types';

export default function Switch({ value, disabled, callBack }) {
  return (
    <SwitchComponent
      onChange={() => callBack(value)}
      checked={value}
      disabled={disabled}
    />
  );
}

Switch.propTypes = {
  value: PropTypes.bool,
  disabled: PropTypes.bool,
  callBack: PropTypes.func,
};
