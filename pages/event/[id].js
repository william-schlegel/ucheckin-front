import PropTypes from 'prop-types';

import ViewEvent from '../../components/Event/Event';
import { EVENT_QUERY } from '../../components/Event/Queries';

export default function Event({ id, initialData }) {
  return <ViewEvent id={id} initialData={initialData} />;
}

Event.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Event.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  // console.log(`initial props event ${id}`);
  const initialData = await apolloClient.query({
    query: EVENT_QUERY,
    variables: { id },
  });
  // console.log('initialData', initialData);
  return {
    id,
    initialData,
  };
};
