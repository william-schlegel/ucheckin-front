import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export default function LicensesDetails(props) {
  const [count, setCount] = useState({});
  const { licenses } = props;
  console.log('LicensesDetails props', props);

  useEffect(() => {
    if (licenses) {
      const now = new Date();
      setCount(
        licenses.reduce(
          (cnt, l) => {
            if (!l.signal.id) {
              cnt.withoutSignal += 1;
            } else if (now > new Date(l.validity)) cnt.notValid += 1;
            else cnt.valid += 1;
            return cnt;
          },
          { withoutSignal: 0, valid: 0, notValid: 0 }
        )
      );
    }
  }, [licenses]);

  if (!licenses) return <p>???</p>;
  return (
    <div>
      <p>{licenses.length}</p>
      <p>sans signal {count.withoutSignal}</p>
      <p>signal valide {count.valid}</p>
      <p>signal non valide {count.notValid}</p>
    </div>
  );
}

LicensesDetails.propTypes = {
  licenses: PropTypes.arrayOf(
    PropTypes.shape({
      signal: PropTypes.string.isRequired,
      validity: PropTypes.string.isRequired,
    })
  ),
};
