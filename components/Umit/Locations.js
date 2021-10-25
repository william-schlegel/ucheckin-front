import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import useConfirm from '../../lib/useConfirm';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import Pagination from '../Pagination';
import { Flex } from '../styles/Form';
import Table, { useColumns } from '../Tables/Table';
import { Layout } from './Layout';
import LocationDetails from './LocationDetail';
import LocationNew from './LocationNew';
import {
  ALL_LOCATIONS_QUERY,
  DELETE_LOCATION_MUTATION,
  PAGINATION_LOCATION_QUERY,
} from './Queries';
import UmitNav from './UmitNav';

export default function Locations() {
  const router = useRouter();

  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_LOCATION_QUERY);
  const [queryLocations, { error, loading, data }] = useLazyQuery(ALL_LOCATIONS_QUERY);
  const [deleteLocationMutation, { error: errorDelete }] = useMutation(DELETE_LOCATION_MUTATION, {
    refetchQueries: [{ query: ALL_LOCATIONS_QUERY }],
    onCompleted: () => router.reload(),
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('umit');
  const [showLocation, setShowLocation] = useState('');
  const [newLocation, setNewLocation] = useState(false);

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    queryPagination();
    queryLocations({ variables });
  }, [queryPagination, queryLocations, page]);

  function viewLocation(id) {
    if (id) setShowLocation(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('company'), 'company'],
    [t('name'), 'name'],
    [t('city'), 'city'],
    [t('contact'), 'contact'],
    [t('telephone'), 'telephone'],
  ]);
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete-location'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteLocationMutation(args),
  });

  function handleCloseShowLocation() {
    setShowLocation('');
  }

  function deleteLocation(id) {
    const location = data.umitLocations.find((o) => o.id === id);
    if (!location) return;
    setArgs({ variables: { where: { id } } });
    setIsOpen(true);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;
  return (
    <Layout>
      <UmitNav active={'locations'} />
      <Head>
        <title>{t('locations')}</title>
      </Head>
      <Confirm />
      {showLocation && (
        <LocationDetails
          open={!!showLocation}
          onClose={handleCloseShowLocation}
          id={showLocation}
        />
      )}
      {newLocation && <LocationNew open={!!newLocation} onClose={() => setNewLocation(false)} />}
      <Flex>
        <Pagination
          page={page}
          error={errorPage}
          loading={loadingPage}
          count={count}
          pageRef="locations"
        />
        <ButtonNew
          onClick={() => {
            setNewLocation(true);
          }}
        />
      </Flex>
      <Table
        columns={columns}
        data={data?.umitLocations}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'view', action: viewLocation },
          { type: 'trash', action: deleteLocation },
        ]}
      />
    </Layout>
  );
}
