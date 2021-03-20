import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import ActionButton from './Buttons/ActionButton';
import { Label } from './styles/Card';

const CounterStyled = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 25%) 1fr;
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

export default function Counter({ label, name, input, handleChange }) {
  const { t } = useTranslation('license');
  return (
    <CounterStyled>
      <Label htmlFor={name}>{label}</Label>
      <div className="counter">
        <ActionButton
          type="minus-circle"
          cb={() =>
            input > 0
              ? handleChange({ type: 'number', name, value: input - 1 })
              : 0
          }
          label={t('minus')}
        />
        <input
          type="number"
          id={name}
          name={name}
          value={input}
          onChange={handleChange}
        />
        <ActionButton
          type="plus-circle"
          cb={() => handleChange({ type: 'number', name, value: input + 1 })}
          label={t('plus')}
        />
      </div>
    </CounterStyled>
  );
}

Counter.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  input: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
};
