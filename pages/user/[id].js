import PropTypes from 'prop-types';
import MyProfile from '../../components/Profile/Profile';

export default function Profile({ query }) {
  if (query.id) return <MyProfile id={query.id} />;
  return null;
}

Profile.propTypes = {
  query: PropTypes.object,
};
