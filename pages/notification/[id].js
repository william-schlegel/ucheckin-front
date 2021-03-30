import PropTypes from 'prop-types';
import ViewNotification from '../../components/Notification/Notification';
import { NOTIFICATION_QUERY } from '../../components/Notification/Queries';

export default function Notification({ id, initialData }) {
  return <ViewNotification id={id} initialData={initialData} />;
}

Notification.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Notification.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  console.log(`id`, id);
  const initialData = await apolloClient.query({
    query: NOTIFICATION_QUERY,
    variables: { id },
  });
  return {
    id,
    initialData: { ...initialData, licenseType: initialData.licenseType?.id },
  };
};
