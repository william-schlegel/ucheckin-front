import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Select from 'react-select';
import styled from 'styled-components';

import ButtonNew from '../Buttons/ButtonNew';
import DatePicker, { dateInMonth, dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Block, DashboardCard, FormBody, H2, Label, RowFull } from '../styles/Card';
import selectTheme from '../styles/selectTheme';

const DONUT_SIZE = 250;
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
  const [dtDeb, setDtDeb] = useState(dateInMonth(-1));
  const [dtFin, setDtFin] = useState(dateNow());
  const [applications, setApplications] = useState([{ value: 'all', label: t('all') }]);
  const [application, setApplication] = useState(0);
  const [dataGraph, setDataGraph] = useState({});

  useEffect(() => {
    queryStat({ variables: { dtDeb, dtFin } });
  }, [queryStat, dtDeb, dtFin]);

  useEffect(() => {
    const apps = new Map();
    if (data) {
      apps.set(applications[0].value, applications[0].label);
      for (const a of data.signalDetections) {
        apps.set(a.application.id, a.application.name);
      }
      setApplications(Array.from(apps).map((a) => ({ value: a[0], label: a[1] })));
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const os = reduceData(data.signalDetections, 'os', applications[application].value);
    const model = reduceData(data.signalDetections, 'model', applications[application].value);
    const apps = reduceData(
      data.signalDetections,
      'application.name',
      applications[application].value
    );
    const signals = reduceData(
      data.signalDetections,
      'signal.name',
      applications[application].value
    );
    setDataGraph({ os, model, apps, signals });
  }, [data, setDataGraph, application]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <div style={{ width: '100%', marginTop: '1rem' }}>
      <DashboardCard>
        <H2>{t('statistics')}</H2>
        <Content>
          <FormBody style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}>
              <RowFull>
                <Label>{t('application')}</Label>
                <Select
                  theme={selectTheme}
                  className="select"
                  value={applications[application]}
                  onChange={(sel) =>
                    setApplication(applications.findIndex((a) => a.value === sel.value))
                  }
                  options={applications}
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
            <div>&nbsp;</div>
          </FormBody>
          <Content style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div>
              {dataGraph.os && (
                <>
                  <h3>{t('statistic:os')}</h3>
                  <Doughnut
                    data={dataGraph.os}
                    width={DONUT_SIZE}
                    height={DONUT_SIZE}
                    style={{
                      width: `${DONUT_SIZE}px`,
                      height: `${DONUT_SIZE}px`,
                    }}
                  />
                </>
              )}
            </div>
            <div>
              {dataGraph.model && (
                <>
                  <h3>{t('statistic:model')}</h3>
                  <Doughnut
                    data={dataGraph.model}
                    width={DONUT_SIZE}
                    height={DONUT_SIZE}
                    style={{
                      width: `${DONUT_SIZE}px`,
                      height: `${DONUT_SIZE}px`,
                    }}
                  />
                </>
              )}
            </div>
            <div>
              {dataGraph.apps && (
                <>
                  <h3>{t('statistic:applications')}</h3>
                  <Doughnut
                    data={dataGraph.apps}
                    width={DONUT_SIZE}
                    height={DONUT_SIZE}
                    style={{
                      width: `${DONUT_SIZE}px`,
                      height: `${DONUT_SIZE}px`,
                    }}
                  />
                </>
              )}
            </div>
            <div>
              {dataGraph.apps && (
                <>
                  <h3>{t('statistic:signals')}</h3>
                  <Doughnut
                    data={dataGraph.signals}
                    width={DONUT_SIZE}
                    height={DONUT_SIZE}
                    style={{
                      width: `${DONUT_SIZE}px`,
                      height: `${DONUT_SIZE}px`,
                    }}
                  />
                </>
              )}
            </div>
          </Content>
        </Content>
      </DashboardCard>
    </div>
  );
}

const Content = styled.div`
  display: flex;
  gap: 1rem;
  h3 {
    text-align: center;
    color: var(--primary);
  }
`;
