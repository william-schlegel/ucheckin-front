import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import Pagination from '../../components/Pagination';
import Table, { useColumns } from '../../components/Table';
import { perPage } from '../../config';
import Loading from '../../components/Loading';
import DisplayError from '../../components/ErrorMessage';

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    countPage: _allApplicationsMeta {
      count
    }
  }
`;

export const ALL_APPLICATIONS_QUERY = gql`
  query ALL_APPLICATIONS_QUERY($skip: Int = 0, $first: Int) {
    allApplications(first: $first, skip: $skip) {
      id
      name
      apiKey
      owner {
        id
        name
      }
      users {
        id
        name
      }
    }
  }
`;

export default function Applications() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.countPage || 1;
  const { t } = useTranslation('application');
  const { data, error, loading } = useQuery(ALL_APPLICATIONS_QUERY, {
    variables: {
      skip: (page - 1) * perPage,
      first: perPage,
    },
  });
  const columns = useColumns([
    ['id', 'id'],
    [t('common:name'), 'name'],
    [t('api-key'), 'apiKey'],
    [t('common:owner'), 'owner.name'],
    [t('common:users'), 'users'],
  ]);

  function editApplication(id) {
    router.push(`/application/${id}`);
    console.log(`edit ${id}`);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>
          {t('applications')} - {t('common:page-count', { page, count })}
        </title>
      </Head>
      <h3>{t('applications')}</h3>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="applications"
      />
      <Table
        columns={columns}
        data={data.allApplications}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'edit', action: editApplication }]}
      />
    </>
  );
}
