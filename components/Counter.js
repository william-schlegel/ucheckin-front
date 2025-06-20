import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import ActionButton from './Buttons/ActionButton';
import { Label } from './styles/Card';

const CounterStyled = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr; // minmax(100px, 40%) 1fr;
  margin-right: auto;
  align-items: center;
  width: 100%;
  .counter {
    display: flex;
    align-items: center;
  }
  input {
    max-width: 10ch;
    margin: 0 1rem;
    font-feature-settings: 'tnum';
    font-variant-numeric: tabular-nums;
  }
`;

const CounterFullStyled = styled(CounterStyled)`
  display: flex;
  flex-direction: row;
  width: 100%;
`;

export default function Counter({ label, name, input, handleChange, min = 0, max, fullWidth }) {
  if (fullWidth)
    return (
      <CounterFullStyled>
        <CounterContent
          label={label}
          name={name}
          input={input}
          handleChange={handleChange}
          min={min}
          max={max}
        />
      </CounterFullStyled>
    );
  return (
    <CounterStyled>
      <CounterContent
        label={label}
        name={name}
        input={input}
        handleChange={handleChange}
        min={min}
        max={max}
      />
    </CounterStyled>
  );
}

const CounterContent = ({ label, name, input, handleChange, min = 0, max }) => {
  const { t } = useTranslation('common');

  function checkValue(value) {
    if (value < min) return min;
    if (max && value > max) return max;
    return value;
  }

  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <div className="counter">
        <ActionButton
          type="minus-circle"
          cb={() => handleChange({ type: 'number', name, value: checkValue(input - 1) })}
          label={t('minus')}
        />
        <input
          type="number"
          id={name}
          name={name}
          value={input}
          onChange={(e) =>
            handleChange({
              type: 'number',
              name,
              value: checkValue(e.target.value),
            })
          }
        />
        <ActionButton
          type="plus-circle"
          cb={() => handleChange({ type: 'number', name, value: checkValue(input + 1) })}
          label={t('plus')}
        />
      </div>
    </>
  );
};

CounterContent.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  input: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

Counter.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  input: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  fullWidth: PropTypes.bool,
};
