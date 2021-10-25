import { useLazyQuery, useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import { perPage } from '../../config';
import DatePicker, { dateInMonth, dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Pagination from '../Pagination';
import { Block, FormBody, Label, RowFull } from '../styles/Card';
import selectTheme from '../styles/selectTheme';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { Layout } from './Layout';
import MeasureDetails from './MeasureDetail';
import { ALL_LOCATIONS_QUERY, ALL_MEASURES_QUERY, PAGINATION_MEASURE_QUERY } from './Queries';
import UmitNav from './UmitNav';

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
    console.log(`variables`, variables);
    queryPagination();
    queryMeasures({ variables });
  }, [queryPagination, queryMeasures, page, location, locations, dtDeb, dtFin]);

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
        <div style={{ color: value < alert ? 'red' : 'green', textAlign: 'right' }}>{value} mm</div>
      ),
    ],
  ]);

  function viewMeasure(id) {
    if (id) setShowMeasure(id);
  }

  function handleCloseShowMeasure() {
    setShowMeasure('');
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <Layout>
      <UmitNav active={'measures'} />
      {showMeasure && (
        <MeasureDetails open={!!showMeasure} onClose={handleCloseShowMeasure} id={showMeasure} />
      )}
      <Head>
        <title>{t('measures')}</title>
      </Head>
      <MeasureLayout>
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
        <div>
          <Pagination
            page={page}
            error={errorPage}
            loading={loadingPage}
            count={count}
            pageRef="measures"
          />
          <Table
            columns={columns}
            data={data?.umitMeasures}
            error={error}
            loading={loading}
            actionButtons={[{ type: 'view', action: viewMeasure }]}
          />
        </div>
      </MeasureLayout>
    </Layout>
  );
}

const MeasureLayout = styled.div`
  display: flex;
  flex-direction: column;
`;
