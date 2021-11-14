import PropTypes from 'prop-types';

import InvoiceContent from '../../components/Invoice/Invoice';

export default function Invoice({ query }) {
  if (query.id) return <InvoiceContent id={query.id} backButton />;
  return <p>new signal</p>;
}

Invoice.propTypes = {
  query: PropTypes.object,
};
