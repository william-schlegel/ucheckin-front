import PropTypes from 'prop-types';
import styled from 'styled-components';
import { formatDate } from '../DatePicker';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const TOLERANCE = 5;

export default function ValidityDate({ value, after, noColor }) {
  const now = new Date();
  const limit = new Date(value);
  const tolerance = new Date(value);
  tolerance.setDate(tolerance.getDate() - TOLERANCE);
  let color = 'inherit';
  if (!noColor) {
    if (after) {
      if (now < limit) color = now > tolerance ? 'orange' : 'red';
    } else {
      if (now > tolerance) color = 'orange';
      if (now > limit) color = 'red';
    }
  }
  return (
    <Container>
      <span style={{ color }}>{formatDate(value)}</span>
    </Container>
  );
}

ValidityDate.defaultProps = {
  after: false,
};

ValidityDate.propTypes = {
  value: PropTypes.string,
  after: PropTypes.bool,
};
