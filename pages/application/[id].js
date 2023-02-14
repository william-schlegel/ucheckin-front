import PropTypes from 'prop-types';

import ViewApplication from '../../components/Application/Application';
import { APPLICATION_QUERY } from '../../components/Application/Queries';

export default function Application({ id, initialData }) {
  return <ViewApplication id={id} initialData={initialData} />;
}

Application.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Application.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  try {
    const initialData = await apolloClient.query({
      query: APPLICATION_QUERY,
      variables: { id },
    });
    return {
      id,
      initialData,
    };
  } catch (e) {
    console.error(e);
    return {
      id,
      initialData: {
        data: {
          apiKey: '',
          application: {
            owner: {},
            invitations: [],
            licenseTypes: [],
            licenses: [],
            notifications: [],
          },
        },
      },
    };
  }
};
