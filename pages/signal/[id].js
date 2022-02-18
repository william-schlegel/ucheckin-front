import PropTypes from 'prop-types';

import ViewSignal from '../../components/Signal/Signal';

export default function Signal({ query }) {
  if (query.id) return <ViewSignal id={query.id} />;
  return <p>new signal</p>;
}

Signal.propTypes = {
  query: PropTypes.object,
};
