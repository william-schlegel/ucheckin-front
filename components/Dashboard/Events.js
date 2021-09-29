import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';
import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';

import Loading from '../Loading';
import Button from '../Tables/Button';
import Image from '../Tables/Image';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

const nbLicenses = 5;

const QUERY_EVENTS = gql`
  query QUERY_EVENTS {
    events(take:${nbLicenses} , orderBy: {validityStart: desc}) {
      id
      name
      description
      validityStart
      validityEnd
      imageHome {
        publicUrlTransformed(transformation: { width: "200", height: "200" })
      }
    }
    eventsCount
  }
`;

export default function DashboardEvent() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_EVENTS);
  const router = useRouter();

  function viewEvent(eventId) {
    router.push(`/event/${eventId}`);
  }

  const columns = useColumns(
    [
      ['eventId', 'id', 'hidden'],
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
        { action: viewEvent },
      ],
      [
        t('event:icon'),
        'imageHome',
        ({ cell: { value } }) => <Image image={value} size={40} rounded />,
      ],
      [
        t('event:validity-start'),
        'validityStart',
        ({ cell: { value } }) => <ValidityDate value={value} after />,
      ],
      [
        t('event:validity-end'),
        'validityEnd',
        ({ cell: { value } }) => <ValidityDate value={value} />,
      ],
    ],
    false
  );

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('events', { count: data.events.length })}
      total={t('events-total')}
      count={data.eventsCount}
    >
      <Table columns={columns} data={data.events} />
    </Dashboard>
  );
}
