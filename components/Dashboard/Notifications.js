import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import Button from '../Tables/Button';
import NotificationType from '../Tables/NotificationType';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

const nbLicenses = 5;

const QUERY_NOTIFICATIONS = gql`
  query QUERY_NOTIFICATIONS {
    notifications(take:${nbLicenses} , orderBy: {startDate: desc}) {
      id
      name
      type
      startDate
      endDate
    }
    notificationsCount
  }
`;

export default function DashboardNotification() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_NOTIFICATIONS);
  const router = useRouter();

  function viewNotif(notifId) {
    router.push(`/notification/${notifId}`);
  }

  const columns = useColumns(
    [
      ['notifId', 'id', 'hidden'],
      [
        t('common:name'),
        'name',
        ({
          column: {
            options: { action },
          },
          cell: { value },
          row: {
            values: { id },
          },
        }) => <Button action={action} label={value} value={id} block />,
        { action: viewNotif },
      ],
      [
        t('notification:type'),
        'type',
        ({ cell: { value } }) => <NotificationType notification={value} />,
      ],
      [
        t('notification:start-date'),
        'startDate',
        ({ cell: { value } }) => <ValidityDate value={value} noColor />,
      ],
      [
        t('notification:end-date'),
        'endDate',
        ({ cell: { value } }) => <ValidityDate value={value} noColor />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('notifications', { count: data.notifications.length })}
      total={t('notifications-total')}
      count={data.notificationsCount}
    >
      <Table columns={columns} data={data.notifications} />
    </Dashboard>
  );
}
