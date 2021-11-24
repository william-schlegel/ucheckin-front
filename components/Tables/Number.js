import PropTypes from 'prop-types';
import styled from 'styled-components';

import { formatMoney, formatPrct } from '../../lib/formatNumber';

const NumberStyle = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  gap: 0.5em;
`;

export default function Number({ value, money, percentage, unit }) {
  if (!value) return null;
  let displayValue = value.toString();
  if (isNaN(value)) return (displayValue = '#NAN');
  else {
    if (money) displayValue = formatMoney(value);
    if (percentage) displayValue = formatPrct(value);
  }
  return (
    <NumberStyle>
      <span>{displayValue}</span>
      <span>{unit}</span>
    </NumberStyle>
  );
}

Number.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  money: PropTypes.bool,
  percentage: PropTypes.bool,
  unit: PropTypes.string,
};
