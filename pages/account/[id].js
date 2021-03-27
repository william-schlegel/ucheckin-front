import PropTypes from 'prop-types';
import MyAccount from '../../components/User/Account';
import { QUERY_ACCOUNT } from '../../components/User/Queries';

export default function Account({ id, initialData }) {
  return <MyAccount id={id} initialData={initialData} />;
}

Account.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Account.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  console.log(`id`, id);
  const initialData = await apolloClient.query({
    query: QUERY_ACCOUNT,
    variables: { id },
  });
  console.log(`initialData`, initialData);
  return { id, initialData: initialData.data.User };
};
