import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useConfirm from '../../lib/useConfirm';
import DatePicker, { dateInMonth, dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import { Block, FormBody, Label, RowFull } from '../styles/Card';
import EntetePage from '../styles/EntetePage';
import selectTheme from '../styles/selectTheme';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { useUser } from '../User/Queries';
import MeasureDetails from './MeasureDetail';
import {
  ALL_LOCATIONS_QUERY,
  ALL_MEASURES_QUERY,
  DELETE_MEASURE_MUTATION,
  PAGINATION_MEASURE_QUERY,
} from './Queries';

export default function Measures() {
  const router = useRouter();

  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_MEASURE_QUERY);
  const [queryMeasures, { error, loading, data }] = useLazyQuery(ALL_MEASURES_QUERY);
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('umit');
  const [showMeasure, setShowMeasure] = useState('');
  const [dtDeb, setDtDeb] = useState(dateInMonth(-12));
  const [dtFin, setDtFin] = useState(dateNow());
  const [locations, setLocations] = useState([{ value: 'all', label: t('all') }]);
  const [location, setLocation] = useState(0);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('umit');
  const { user } = useUser();
  const { setAction } = useAction();
  const searchFields = [
    { field: 'company.contains', label: t('company'), type: 'text' },
    { field: 'sensor.name.contains', label: t('sensor-name'), type: 'text' },
    { field: 'sensor.building.contains', label: t('building'), type: 'text' },
    { field: 'sensor.unit.contains', label: t('unit'), type: 'text' },
    { field: 'sensor.ref.contains', label: t('ref'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter, resetFilters } = useFilter();
  const [deleteMeasure] = useMutation(DELETE_MEASURE_MUTATION, {
    refetchQueries: [
      {
        query: ALL_MEASURES_QUERY,
        variables: { skip: 0, take: perPage },
      },
    ],
    onCompleted: (data) => {
      setAction('delete', 'measure', data.deleteUmitMeasure.id);
      router.push('/umit/measures');
    },
  });
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete-measure'),
    message: t('you-confirm-measure'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteMeasure(args),
  });

  useQuery(ALL_LOCATIONS_QUERY, {
    onCompleted: (data) =>
      setLocations([
        { value: 'all', label: t('all') },
        ...data.umitLocations.map((l) => ({ value: l.id, label: l.name })),
      ]),
  });

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
      where: {
        AND: [
          {
            measureDate: {
              lte: dtFin,
            },
          },
          {
            measureDate: {
              gt: dtDeb,
            },
          },
        ],
      },
    };
    if (locations[location].value !== 'all') {
      variables.where.AND.push({ location: { id: { equals: locations[location].value } } });
    }
    if (filters) variables.where.AND.push(filters);
    queryPagination({ variables });
    queryMeasures({ variables });
  }, [queryPagination, queryMeasures, page, location, locations, dtDeb, dtFin, filters]);

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('company'), 'company'],
    [t('location'), 'location.name'],
    [t('building'), 'sensor.building'],
    [t('unit'), 'sensor.unit'],
    [t('ref'), 'sensor.ref'],
    [t('sensor-name'), 'sensor.name'],
    [
      t('measure-date'),
      'measureDate',
      ({ cell: { value } }) => <ValidityDate value={value} noColor />,
    ],
    [
      t('thickness'),
      'thickness',
      ({
        cell: { value },
        row: {
          values: { alert },
        },
      }) => (
        <div style={{ color: value < alert ? 'red' : 'green', textAlign: 'right' }}>
          {value.toFixed(2)} mm
        </div>
      ),
    ],
  ]);

  function viewMeasure(id) {
    if (id) setShowMeasure(id);
  }

  function handleDeleteMeasure(id) {
    setArgs({ variables: { where: { id } } });
    setIsOpen(true);
  }

  function handleCloseShowMeasure() {
    setShowMeasure('');
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      {showMeasure && (
        <MeasureDetails open={!!showMeasure} onClose={handleCloseShowMeasure} id={showMeasure} />
      )}
      <Head>
        <title>UCheck In - {t('measures')}</title>
      </Head>
      <Confirm />
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <EntetePage>
        <h3>{t('measures')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
      </EntetePage>
      <MeasureLayout>
        <div>
          <FormBody style={{ display: 'flex', width: '100%', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '0.5rem', minWidth: '30%', alignItems: 'center' }}>
              <Label>{t('location')}</Label>
              <Select
                theme={selectTheme}
                className="select"
                value={locations[location]}
                onChange={(sel) => setLocation(locations.findIndex((a) => a.value === sel.value))}
                options={locations}
              />
            </div>
            <RowFull>
              <Block>
                <Label htmlFor="startDate">{t('start-date')} </Label>
                <DatePicker
                  id="startDate"
                  ISOStringValue={dtDeb}
                  onChange={(dt) => setDtDeb(dt.toISOString())}
                />
              </Block>
            </RowFull>
            <RowFull>
              <Block>
                <Label htmlFor="endDate">{t('end-date')} </Label>
                <DatePicker
                  id="endDate"
                  ISOStringValue={dtFin}
                  onChange={(dt) => setDtFin(dt.toISOString())}
                />
              </Block>
            </RowFull>
          </FormBody>
        </div>
        <Pagination
          page={page}
          error={errorPage}
          loading={loadingPage}
          count={count}
          pageRef="umit/measures"
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
          data={data?.umitMeasures}
          error={error}
          loading={loading}
          actionButtons={[
            { type: 'view', action: viewMeasure },
            { type: 'trash', action: handleDeleteMeasure },
          ]}
        />
      </MeasureLayout>
    </>
  );
}

const MeasureLayout = styled.div`
  display: flex;
  flex-direction: column;
`;
