import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useConfirm from '../../lib/useConfirm';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { useUser } from '../User/Queries';
import { ALL_SENSORS_QUERY, DELETE_SENSOR_MUTATION, PAGINATION_SENSOR_QUERY } from './Queries';
import SensorChart from './SensorChart';
import SensorDetail from './SensorDetail';

export default function Sensors() {
  const router = useRouter();
  const { setAction } = useAction();
  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_SENSOR_QUERY);
  const [querySensors, { error, loading, data }] = useLazyQuery(ALL_SENSORS_QUERY);
  const [deleteSensorMutation, { error: errorDelete }] = useMutation(DELETE_SENSOR_MUTATION, {
    refetchQueries: [{ query: ALL_SENSORS_QUERY }],
    onCompleted: (data) => {
      setAction('delete', 'sensor', data.deleteUmitSensor.id, data.deleteUmitSensor.name);
      router.reload();
    },
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('umit');
  const [showSensor, setShowSensor] = useState('');
  const [showChart, setShowChart] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('umit');
  const { user } = useUser();
  const searchFields = [
    { field: 'company.contains', label: t('company'), type: 'text' },
    { field: 'name.contains', label: t('sensor-name'), type: 'text' },
    { field: 'building.contains', label: t('building'), type: 'text' },
    { field: 'unit.contains', label: t('unit'), type: 'text' },
    { field: 'ref.contains', label: t('ref'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter, resetFilters } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables });
    querySensors({ variables });
  }, [queryPagination, querySensors, page, filters]);

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
        // console.log(`value`, value);
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

  function viewChart(id) {
    if (id) setShowChart(id);
  }

  function handleCloseShowSensor() {
    setShowSensor('');
  }

  function handleCloseShowChart() {
    setShowChart('');
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
    <>
      <Head>
        <title>{t('sensors')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <EntetePage>
        <h3>{t('sensors')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
      </EntetePage>
      <Confirm />
      {showSensor && (
        <SensorDetail open={!!showSensor} onClose={handleCloseShowSensor} id={showSensor} />
      )}
      {showChart && (
        <SensorChart open={!!showChart} onClose={handleCloseShowChart} id={showChart} />
      )}
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="umit/sensors"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageUmit}
      />
      <ActualFilter fields={searchFields} actualFilter={filters} removeFilters={resetFilters} />
      <Table
        columns={columns}
        data={data?.umitSensors}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'chart', action: viewChart },
          { type: 'view', action: viewSensor },
          { type: 'trash', action: deleteSensor },
        ]}
      />
    </>
  );
}
