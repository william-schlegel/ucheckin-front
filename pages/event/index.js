import PropTypes from 'prop-types';

import { dateDay, dateInMonth } from '../../components/DatePicker';
import ViewNotification from '../../components/Notification/Notification';
import { CURRENT_USER_QUERY } from '../../components/User/Queries';

export default function Notification({ initialData }) {
  return <ViewNotification id="" initialData={initialData} />;
}

Notification.propTypes = {
  initialData: PropTypes.object,
};

Notification.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const user = await apolloClient.query({ query: CURRENT_USER_QUERY });
  const init = {
    data: {
      Notification: {
        id: '',
        name: '',
        owner: {
          id: user?.data?.authenticatedItem.id,
          name: user?.data?.authenticatedItem.name,
        },
        displayName: '',
        type: 'simple',
        startDate: dateDay(),
        endDate: dateInMonth(1),
        application: {
          id: '',
          name: '',
        },
        signal: {
          id: '',
          name: '',
        },
        items: [],
      },
    },
  };

  return {
    initialData: init,
  };
};
