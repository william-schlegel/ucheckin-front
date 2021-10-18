import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import useConfirm from '../../lib/useConfirm';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { Layout } from './layout';
import { ALL_SENSORS_QUERY, DELETE_SENSOR_MUTATION, PAGINATION_SENSOR_QUERY } from './Queries';
import SensorDetail from './SensorDetail';
import UmitNav from './UmitNav';

export default function Sensors() {
  const router = useRouter();

  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_SENSOR_QUERY);
  const [querySensors, { error, loading, data }] = useLazyQuery(ALL_SENSORS_QUERY);
  const [deleteSensorMutation, { error: errorDelete }] = useMutation(DELETE_SENSOR_MUTATION, {
    refetchQueries: [{ query: ALL_SENSORS_QUERY }],
    onCompleted: () => router.reload(),
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('umit');
  const [showSensor, setShowSensor] = useState('');

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    queryPagination();
    querySensors({ variables });
  }, [queryPagination, querySensors, page]);

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('company'), 'company'],
    [t('building'), 'building'],
    [t('unit'), 'unit'],
    [t('ref'), 'ref'],
    [t('sensor-name'), 'name'],
    [t('description'), 'description'],
    [
      t('last-measure'),
      'lastMeasureAt',
      ({ cell: { value } }) => {
        console.log(`value`, value);
        return value ? <ValidityDate value={value} noColor /> : t('never-settled');
      },
    ],
  ]);
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete-sensor'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteSensorMutation(args),
  });

  function viewSensor(id) {
    if (id) setShowSensor(id);
  }

  function handleCloseShowSensor() {
    setShowSensor('');
  }

  function deleteSensor(id) {
    const sensor = data.umitSensors.find((o) => o.id === id);
    if (!sensor) return;
    setArgs({ variables: { where: { id } } });
    setIsOpen(true);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;
  return (
    <Layout>
      <UmitNav active={'sensors'} />
      <Head>
        <title>{t('sensors')}</title>
      </Head>
      <Confirm />
      {showSensor && (
        <SensorDetail open={!!showSensor} onClose={handleCloseShowSensor} id={showSensor} />
      )}
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="sensors"
      />
      <Table
        columns={columns}
        data={data?.umitSensors}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'view', action: viewSensor },
          { type: 'trash', action: deleteSensor },
        ]}
      />
    </Layout>
  );
}
