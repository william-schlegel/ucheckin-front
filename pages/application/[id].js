import PropTypes from 'prop-types';

export default function Application({ query }) {
  return <div>Application {query.id}</div>;
}

Application.propTypes = {
  query: PropTypes.object,
};
