import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useRef, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Grid, PieChart } from 'react-feather';
import Select from 'react-select';
import styled from 'styled-components';

import { IconButtonStyles } from '../Buttons/ActionButton';
import ButtonNew from '../Buttons/ButtonNew';
import DatePicker, { dateInDay, dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Block, DashboardCard, FormBody, H2, Label, RowFull } from '../styles/Card';
import selectTheme from '../styles/selectTheme';
import NumberField from '../Tables/Number';
import Table, { useColumns } from '../Tables/Table';

const DONUT_HEIGHT = 250;
const DONUT_WIDTH = 300;
const COLOR_SCHEME = [
  '#ff0000',
  '#ff8700',
  '#ffd300',
  '#deff0a',
  '#a1ff0a',
  '#0aff99',
  '#0aefff',
  '#147df5',
  '#580aff',
  '#be0aff',
];

const OPTIONS = {
  plugins: {
    legend: {
      display: false,
      position: 'right',
      align: 'middle',
    },
  },
  responsive: true,
};

export const QUERY_STATISTICS = gql`
  query QUERY_STATISTICS($dtDeb: DateTime!, $dtFin: DateTime!) {
    signalDetections(where: { AND: [{ date: { gte: $dtDeb } }, { date: { lte: $dtFin } }] }) {
      date
      os
      model
      version
      chanel
      application {
        id
        name
      }
      signal {
        id
        name
      }
    }
  }
`;

function createColors(obj) {
  function randomColor() {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    return `rgb(${r},${g},${b})`;
  }

  const nbColor = obj.datasets[0].data.length;
  for (let c = 0; c < nbColor; c += 1) {
    if (c < COLOR_SCHEME.length) obj.datasets[0].backgroundColor.push(COLOR_SCHEME[c]);
    else obj.datasets[0].backgroundColor.push(randomColor());
  }
}

function reduceData(data, field, appId) {
  const initialValue = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };
  if (!data) return initialValue;
  let fdata = data;
  if (appId !== 'all') {
    fdata = data.filter((d) => d.application.id === appId);
  }

  const flds = field.split('.');
  const res = fdata.reduce((tot, v) => {
    let value = v;
    for (let i = 0; i < flds.length; i += 1) value = value[flds[i]];
    const id = tot.labels.findIndex((l) => l === value);
    if (id < 0) {
      tot.labels.push(value);
      tot.datasets[0].data.push(1);
    } else {
      tot.datasets[0].data[id] += 1;
    }
    return tot;
  }, initialValue);
  createColors(res);
  return res;
}

export default function DashboardStatistics() {
  const { t } = useTranslation('dashboard');
  const router = useRouter();
  const [queryStat, { error, loading, data }] = useLazyQuery(QUERY_STATISTICS);
  const [dtDeb, setDtDeb] = useState(dateInDay(-7));
  const [dtFin, setDtFin] = useState(dateNow());
  const applications = useRef([{ value: 'all', label: t('all') }]);
  const [application, setApplication] = useState(0);
  const [dataGraph, setDataGraph] = useState({});

  useEffect(() => {
    queryStat({ variables: { dtDeb, dtFin } });
  }, [queryStat, dtDeb, dtFin]);

  useEffect(() => {
    const apps = new Map();
    if (data) {
      apps.set(applications.current[0].value, applications.current[0].label);
      for (const a of data.signalDetections) {
        apps.set(a.application.id, a.application.name);
      }
      applications.current = Array.from(apps).map((a) => ({ value: a[0], label: a[1] }));
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const os = reduceData(data.signalDetections, 'os', applications.current[application].value);
    const model = reduceData(
      data.signalDetections,
      'model',
      applications.current[application].value
    );
    const apps = reduceData(
      data.signalDetections,
      'application.name',
      applications.current[application].value
    );
    const signals = reduceData(
      data.signalDetections,
      'signal.name',
      applications.current[application].value
    );
    setDataGraph({ os, model, apps, signals });
  }, [data, setDataGraph, application]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <div style={{ width: '100%', marginTop: '1rem' }}>
      <DashboardCard>
        <H2>
          {t('statistics')} - {t('nb-detect', { count: data?.signalDetections?.length })}
        </H2>
        <Content>
          <FormBody style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <RowFull>
                <Label>{t('application')}</Label>
                <Select
                  theme={selectTheme}
                  className="select"
                  value={applications.current[application]}
                  onChange={(sel) =>
                    setApplication(applications.current.findIndex((a) => a.value === sel.value))
                  }
                  options={applications.current}
                />
              </RowFull>
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
              <ButtonNew label={t('stat-details')} onClick={() => router.push('/statistics')} />
            </div>
          </FormBody>
          <StatData title={t('statistic:os')} data={dataGraph.os} />
          <StatData title={t('statistic:model')} data={dataGraph.model} />
          <StatData title={t('statistic:applications')} data={dataGraph.apps} />
          <StatData title={t('statistic:signals')} data={dataGraph.signals} />
        </Content>
      </DashboardCard>
    </div>
  );
}

function StatData({ title, data }) {
  const [table, setTable] = useState(false);
  const [dataTbl, setDataTbl] = useState([]);
  const { t } = useTranslation('dashboard');

  useEffect(() => {
    if (data)
      setDataTbl(
        data.datasets[0].data.map((d, i) => ({
          label: data.labels[i],
          value: [d, data.datasets[0].backgroundColor[i]],
        }))
      );
  }, [data]);

  const columns = useColumns(
    [
      [t('label'), 'label'],
      [
        t('value'),
        'value',
        ({ cell: { value } }) => <NumberField value={value[0].toFixed(0)} color={value[1]} />,
      ],
    ],
    false
  );

  return (
    <div>
      {data && (
        <Graph>
          <h3>
            {title}
            <IconButtonStyles type="button" onClick={() => setTable((prev) => !prev)}>
              {table ? <PieChart size={16} /> : <Grid size={16} />}
            </IconButtonStyles>
          </h3>
          {table ? (
            <Table columns={columns} data={dataTbl} />
          ) : (
            <Doughnut
              data={data}
              width={DONUT_WIDTH}
              height={DONUT_HEIGHT}
              style={{
                width: `${DONUT_WIDTH}px`,
                height: `${DONUT_HEIGHT}px`,
              }}
              options={OPTIONS}
            />
          )}{' '}
        </Graph>
      )}
    </div>
  );
}

const Graph = styled.div`
  border: 1px solid var(--light-grey);
  padding: 0 1rem;
  border-radius: 5px;
`;

const Content = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(auto-fit, calc(${DONUT_WIDTH}px + 1rem));
  gap: 0.5rem;
  /* display: flex;
  flex-wrap: wrap;
  > * {
    flex: 1 0 calc(${DONUT_WIDTH}px + 1rem);
  } */
  h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 0.5em;
    color: var(--primary);
    border-bottom: 1px solid var(--light-grey);
  }
`;
