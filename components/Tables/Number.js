import PropTypes from 'prop-types';
import styled from 'styled-components';

const NumberStyle = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

export default function Number({ value }) {
  return (
    <NumberStyle>
      <span>{value}</span>
    </NumberStyle>
  );
}

Number.propTypes = {
  value: PropTypes.number.isRequired,
};
