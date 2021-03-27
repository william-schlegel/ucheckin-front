import PropTypes from 'prop-types';
import MyProfile from '../../components/User/Profile';
import { QUERY_PROFILE } from '../../components/User/Queries';

export default function Profile({ id, initialData }) {
  return <MyProfile id={id} initialData={initialData} />;
}

Profile.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Profile.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  console.log(`id`, id);
  const initialData = await apolloClient.query({
    query: QUERY_PROFILE,
    variables: { id },
  });
  return {
    id,
    initialData: {
      ...initialData.data.User,
      role: initialData.data.User.role.id,
    },
  };
};
