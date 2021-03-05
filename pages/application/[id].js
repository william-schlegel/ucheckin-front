import Head from 'next/head';
import PropTypes from 'prop-types';
import ViewApplication from '../../components/Application';

export default function Application({ query }) {
  if (query.id) return <ViewApplication id={query.id} />;
  return <p>new app</p>;
}

Application.propTypes = {
  query: PropTypes.object,
};
