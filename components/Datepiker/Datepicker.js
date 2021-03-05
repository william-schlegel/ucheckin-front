import PropTypes from 'prop-types';
import { useDatepicker, START_DATE } from '@datepicker-react/hooks';
import { useState } from 'react';
import Month from './Month';
import DatepickerContext from './datepickerContext';

function Datepicker({ value, onChange }) {
  const [state, setState] = useState({
    startDate: null,
    endDate: null,
    focusedInput: START_DATE,
  });

  function handleDateChange(data) {
    if (!data.focusedInput) {
      setState({ ...data, focusedInput: START_DATE });
    } else {
      setState(data);
    }
  }

  const {
    firstDayOfWeek,
    activeMonths,
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
  } = useDatepicker({
    startDate: state.startDate,
    endDate: state.endDate,
    focusedInput: state.focusedInput,
    onDatesChange: handleDateChange,
    numberOfMonths: 2,
  });

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
      }}
    >
      <div
        style={{
          display: 'grid',
          margin: '32px 0 0',
          gridTemplateColumns: `repeat(${activeMonths.length}, 300px)`,
          gridGap: '0 64px',
        }}
      >
        <button type="button" onClick={goToPreviousMonths}>
          {'<'}
        </button>
        {activeMonths.map((month) => (
          <Month
            key={`${month.year}-${month.month}`}
            year={month.year}
            month={month.month}
            firstDayOfWeek={firstDayOfWeek}
          />
        ))}
        <button type="button" onClick={goToNextMonths}>
          {'>'}
        </button>
      </div>
    </DatepickerContext.Provider>
  );
}

Datepicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Datepicker;
