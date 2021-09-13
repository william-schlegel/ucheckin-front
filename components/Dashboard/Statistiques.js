import { useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import Select from 'react-select';

import DatePicker, { dateInMonth, dateNow } from '../DatePicker';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import {
  Block,
  DashboardCard,
  FormBody,
  H2,
  Label,
  RowFull,
} from '../styles/Card';
import selectTheme from '../styles/selectTheme';

const DONUT_SIZE = 250;

const QUERY_STATISTIQUES = gql`
  query QUERY_STATISTIQUES($dtDeb: String!, $dtFin: String!) {
    allSignalDetections(
      where: { AND: [{ date_gt: $dtDeb }, { date_lt: $dtFin }] }
    ) {
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

function reduceData(data, callback, filter) {
  let fdata = data;
  console.log(`filter`, filter);
  if (filter !== 'all') {
    fdata = data.filter((d) => d.application.id === filter);
  }

  return fdata.reduce((tot, v) => callback(tot, v), {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });
}

function createColors(obj) {
  function randomColor() {
    const r = Math.random() * 255;
    const g = Math.random() * 255;
    const b = Math.random() * 255;
    return `rgb(${r},${g},${b})`;
  }

  const nbColor = obj.datasets[0].data.length;
  for (let c = 0; c < nbColor; c += 1)
    obj.datasets[0].backgroundColor.push(randomColor());
}

export default function DashboardStatistiques() {
  const { t } = useTranslation('dashboard');
  const [queryStat, { error, loading, data }] = useLazyQuery(
    QUERY_STATISTIQUES
  );
  const [dtDeb, setDtDeb] = useState(dateInMonth(-1));
  const [dtFin, setDtFin] = useState(dateNow());
  const [applications, setApplications] = useState([
    { value: 'all', label: t('all') },
  ]);
  const [application, setApplication] = useState(0);
  const [dataGraph, setDataGraph] = useState({});

  useEffect(() => {
    queryStat({ variables: { dtDeb, dtFin } });
  }, [queryStat, dtDeb, dtFin]);

  useEffect(() => {
    const apps = new Map();
    if (data) {
      apps.set(applications[0].value, applications[0].label);
      for (const a of data.allSignalDetections) {
        apps.set(a.application.id, a.application.name);
      }
      setApplications(
        Array.from(apps).map((a) => ({ value: a[0], label: a[1] }))
      );
    }
  }, [data]);

  useEffect(() => {
    if (!data) return;
    const os = reduceData(
      data.allSignalDetections,
      (tot, v) => {
        const id = tot.labels.findIndex((l) => l === v.os);
        if (id < 0) {
          tot.labels.push(v.os);
          tot.datasets[0].data.push(1);
          if (v.os === 'android')
            tot.datasets[0].backgroundColor.push('rgb(0,255,0)');
          else if (v.os === 'ios')
            tot.datasets[0].backgroundColor.push('rgb(0,0,0)');
          else tot.datasets[0].backgroundColor.push('rgb(128,128,128)');
        } else {
          tot.datasets[0].data[id] += 1;
        }
        return tot;
      },
      applications[application].value
    );
    const model = reduceData(
      data.allSignalDetections,
      (tot, v) => {
        const id = tot.labels.findIndex((l) => l === v.model);
        if (id < 0) {
          tot.labels.push(v.model);
          tot.datasets[0].data.push(1);
        } else {
          tot.datasets[0].data[id] += 1;
        }
        return tot;
      },
      applications[application].value
    );
    createColors(model);
    const apps = reduceData(
      data.allSignalDetections,
      (tot, v) => {
        const id = tot.labels.findIndex((l) => l === v.application.name);
        if (id < 0) {
          tot.labels.push(v.application.name);
          tot.datasets[0].data.push(1);
        } else {
          tot.datasets[0].data[id] += 1;
        }
        return tot;
      },
      applications[application].value
    );
    createColors(apps);
    const signals = reduceData(
      data.allSignalDetections,
      (tot, v) => {
        const id = tot.labels.findIndex((l) => l === v.signal.name);
        if (id < 0) {
          tot.labels.push(v.signal.name);
          tot.datasets[0].data.push(1);
        } else {
          tot.datasets[0].data[id] += 1;
        }
        return tot;
      },
      applications[application].value
    );
    createColors(signals);
    setDataGraph((prev) => ({ ...prev, os, model, apps, signals }));
  }, [data, setDataGraph, application]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <div style={{ width: '100%', marginTop: '1rem' }}>
      <DashboardCard>
        <H2>{t('statistiques')}</H2>
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
                  value={applications[application]}
                  onChange={(sel) =>
                    setApplication(
                      applications.findIndex((a) => a.value === sel.value)
                    )
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
            </div>
            <div>&nbsp;</div>
          </FormBody>
          <Content
            style={{ flexWrap: 'wrap', justifyContent: 'space-between' }}
          >
            <div>
              {dataGraph.os && (
                <>
                  <h3>{t('os')}</h3>
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
                  <h3>{t('model')}</h3>
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
                  <h3>{t('applications')}</h3>
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
                  <h3>{t('signals')}</h3>
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
