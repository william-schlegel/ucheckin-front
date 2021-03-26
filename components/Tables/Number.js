import PropTypes from 'prop-types';
import styled from 'styled-components';
import { formatMoney, formatPrct } from '../../lib/formatNumber';

const NumberStyle = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
`;

export default function Number({ value, money, percentage }) {
  let displayValue = value.toString();
  if (money) displayValue = formatMoney(value);
  if (percentage) displayValue = formatPrct(value);
  return (
    <NumberStyle>
      <span>{displayValue}</span>
    </NumberStyle>
  );
}

Number.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  money: PropTypes.bool,
  percentage: PropTypes.bool,
};
