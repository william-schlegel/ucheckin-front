import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';

import Loading from '../Loading';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { QUERY_USER_ACTIONS } from './Queries';

export default function Actions({ userId }) {
  const { loading, data } = useQuery(QUERY_USER_ACTIONS, { variables: { id: userId } });
  const { t } = useTranslation('user');

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('common:date'),
        'dateAction',
        ({ cell: { value } }) => <ValidityDate value={value} noColor />,
      ],
      [t('action-name'), 'name'],
      [t('action-type'), 'itemType'],
      [t('action-data'), 'itemData'],
    ],
    false
  );

  if (loading) return <Loading size={32} />;
  if (!data) return null;
  return <Table columns={columns} data={data.userActions} rowPerPage={10} withPagination />;
}
