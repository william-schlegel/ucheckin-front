// import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

// import Button from '../Tables/Button';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

export default function NotificationsTable({ notifications, actionButtons }) {
  const { t } = useTranslation('notification');
  // const router = useRouter();
  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('common:name'),
        'name',
        // ({
        //   column: {
        //     options: { action },
        //   },
        //   cell: { value },
        //   row: {
        //     values: { id },
        //   },
        // }) => <Button action={action} label={value} value={id} block />,
        // { action: viewNotification },
      ],

      [t('common:signal'), 'signal.name'],
      [t('start-date'), 'startDate', ({ cell: { value } }) => <ValidityDate value={value} after />],
      [t('end-date'), 'endDate', ({ cell: { value } }) => <ValidityDate value={value} />],
    ],
    !!actionButtons
  );

  // function viewNotification(id) {
  //   router.push(`/notification/${id}`);
  // }

  return (
    <>
      <Table columns={columns} data={notifications} actionButtons={actionButtons} withPagination />
    </>
  );
}

NotificationsTable.propTypes = {
  invitations: PropTypes.array,
  actionButtons: PropTypes.array,
};
