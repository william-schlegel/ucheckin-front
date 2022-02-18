import PropTypes from 'prop-types';

import { UMIX_QUERY } from '../../components/Umix/Queries';
import ViewUmix from '../../components/Umix/Umix';

export default function Umix({ id, initialData }) {
  return <ViewUmix id={id} initialData={initialData} />;
}

Umix.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Umix.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  const initialData = await apolloClient.query({
    query: UMIX_QUERY,
    variables: { id },
  });
  return {
    id,
    initialData,
  };
};
