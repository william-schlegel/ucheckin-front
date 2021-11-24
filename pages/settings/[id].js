import PropTypes from 'prop-types';

import { QUERY_SETTINGS } from '../../components/User/Queries';
import MySettings from '../../components/User/Settings';

export default function Account({ id, initialData }) {
  return <MySettings id={id} initialData={initialData} />;
}

Account.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Account.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  const initialData = await apolloClient.query({
    query: QUERY_SETTINGS,
    variables: { id },
  });
  return { id, initialData };
};
