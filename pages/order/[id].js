import PropTypes from 'prop-types';
import OrderContent from '../../components/Order/Order';

export default function Order({ query }) {
  if (query.id) return <OrderContent id={query.id} backButton />;
  return <p>new signal</p>;
}

Order.propTypes = {
  query: PropTypes.object,
};
