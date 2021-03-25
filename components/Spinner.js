import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';
import { RefreshCw } from 'react-feather';

const rotating = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;

const SpinnerContainer = styled.div`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  animation: ${rotating} 2s linear infinite;
`;

export default function Spinner({ size }) {
  return (
    <SpinnerContainer>
      <RefreshCw size={size} />
    </SpinnerContainer>
  );
}

Spinner.defaultProps = {
  size: 24,
};

Spinner.propTypes = {
  size: PropTypes.number,
};
