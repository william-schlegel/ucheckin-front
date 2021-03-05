import PropTypes from 'prop-types';
import { useMonth } from '@datepicker-react/hooks';
import Day from './Day';

function Month({ year, month, firstDayOfWeek }) {
  const { days, weekdayLabels, monthLabel } = useMonth({
    year,
    month,
    firstDayOfWeek,
  });

  return (
    <div>
      <div style={{ textAlign: 'center', margin: '0 0 16px' }}>
        <strong>{monthLabel}</strong>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          justifyContent: 'center',
        }}
      >
        {weekdayLabels.map((dayLabel) => (
          <div style={{ textAlign: 'center' }} key={`${month}-${dayLabel}`}>
            {dayLabel}
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          justifyContent: 'center',
        }}
      >
        {days.map((day) => (
          <Day
            date={day.date}
            key={`${month}-${day.dayLabel}`}
            day={day.dayLabel}
          />
        ))}
      </div>
    </div>
  );
}

Month.propTypes = {
  year: PropTypes.number,
  month: PropTypes.number,
  firstDayOfWeek: PropTypes.number,
};

export default Month;
