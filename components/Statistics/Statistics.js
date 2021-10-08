import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import SearchField, { ActualFilter, useFilter } from '../SearchField';
import EntetePage from '../styles/EntetePage';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { useUser } from '../User/Queries';
import { ALL_STATISTICS_QUERY, PAGINATION_QUERY } from './Queries';
import StatisticDetails from './StatisticDetails';

export default function Statistics() {
  const router = useRouter();
  const [
    queryPagination,
    { error: errorPage, loading: loadingPage, data: dataPage },
  ] = useLazyQuery(PAGINATION_QUERY);
  const [queryStatistics, { error, loading, data }] = useLazyQuery(ALL_STATISTICS_QUERY);

  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('statistic');
  const [showStatistic, setShowStatistic] = useState('');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('statistic');
  const { user } = useUser();

  const searchFields = [
    { field: 'date.gte', label: t('start-date'), type: 'date' },
    { field: 'date.lte', label: t('end-date'), type: 'date' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryStatistics({ variables });
  }, [filters, queryPagination, queryStatistics, page]);

  function viewStatistic(id) {
    if (id) setShowStatistic(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('date'), 'date', ({ cell: { value } }) => <ValidityDate value={value} noColor />],
    [t('os'), 'os'],
    [t('model'), 'model'],
    [t('application'), 'application.name'],
    [t('signal'), 'signal.name'],
  ]);

  function handleCloseShowStatistic() {
    setShowStatistic('');
  }
  console.log(`data statistics`, data);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('statistics')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      {showStatistic && (
        <StatisticDetails
          open={!!showStatistic}
          onClose={handleCloseShowStatistic}
          id={showStatistic}
        />
      )}
      <EntetePage>
        <h3>{t('statistics')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="statistics"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageStatistic}
      />
      <ActualFilter fields={searchFields} actualFilter={filters} />
      <Table
        columns={columns}
        data={data?.statistics}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'view', action: viewStatistic }]}
      />
    </>
  );
}
