import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import Dashboard from '../Dashboard';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Button from '../Tables/Button';
import Table, { useColumns } from '../Tables/Table';
import UmixRT from '../Tables/UmixRT';
import UmixStatus from '../Tables/UmixStatus';
import { RTServerStatus } from '../Umix/Umixes';
import { useUser } from '../User/Queries';

const nbUmix = 5;

const QUERY_UMIXES = gql`
  query QUERY_UMIXES {
    umixes(take:${nbUmix} , orderBy: {modificationDate: desc}) {
      id
      name
      description
      status(orderBy: { modificationDate: desc }, take: 1) {
        status
        modificationDate
      }
    }
    umixesCount
  }
`;

const socket = io(process.env.NEXT_PUBLIC_SERVER_UMIX);

export default function DashboardUmix() {
  const { t } = useTranslation('dashboard');
  const { error, loading, data } = useQuery(QUERY_UMIXES);
  const router = useRouter();
  const user = useUser();
  const userId = user?.user?.id;
  const [umixes, setUmixes] = useState([]);
  const [connected, setConnected] = useState(false);

  function viewUmix(umixId) {
    router.push(`/umix/${umixId}`);
  }
  useEffect(() => {
    if (data?.umixes) {
      setUmixes(data.umixes.map((umix) => ({ ...umix, connected: false })));
    }
  }, [data?.umixes]);

  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
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
        { action: viewUmix },
      ],
      [t('common:description'), 'description'],
      [
        t('umix:status'),
        'status',
        ({ cell: { value } }) => <UmixStatus status={value[0].status} noChange />,
      ],
      [
        t('umix:connection-status'),
        'connected',
        ({ cell: { value } }) => <UmixRT connected={value} />,
      ],
    ],
    false
  );
  useEffect(() => {
    if (userId && socket && socket.connected && umixes.length) {
      socket.once().emit('identification', { userId }, () => {
        console.log(`${userId} connected to RT`);
      });
      socket.once().emit('umix-status', null, (umixesStatus) => {
        for (const umix of umixes) {
          const status = umixesStatus.find((u) => u.umixId === umix.id);
          if (status) umix.connected = status.connected;
        }
        setUmixes([...umixes]);
      });
      socket.on('umix-connexion-status', (id, status) => {
        const umix = umixes.find((umix) => umix.id === id);
        if (umix) {
          umix.connected = status;
          setUmixes([...umixes]);
        }
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [userId, umixes.length]);

  if (socket.connected !== connected) setConnected(socket.connected);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Dashboard
      title={t('umixes', { count: data.umixes.length })}
      total={t('umixes-total')}
      count={data.umixesCount}
    >
      <RTServerStatus status={connected}>
        {t('umix:server-status', {
          status: connected ? t('umix:connected') : t('umix:disconnected'),
        })}
      </RTServerStatus>

      <Table columns={columns} data={umixes} />
    </Dashboard>
  );
}
