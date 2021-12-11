import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useConfirm from '../../lib/useConfirm';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import EntetePage from '../styles/EntetePage';
import Table, { useColumns } from '../Tables/Table';
import LocationDetails from './LocationDetail';
import LocationNew from './LocationNew';
import {
  ALL_LOCATIONS_QUERY,
  DELETE_LOCATION_MUTATION,
  PAGINATION_LOCATION_QUERY,
} from './Queries';

export default function Locations() {
  const router = useRouter();
  const { setAction } = useAction();
  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_LOCATION_QUERY);
  const [queryLocations, { error, loading, data }] = useLazyQuery(ALL_LOCATIONS_QUERY);
  const [deleteLocationMutation, { error: errorDelete }] = useMutation(DELETE_LOCATION_MUTATION, {
    refetchQueries: [{ query: ALL_LOCATIONS_QUERY }],
    onCompleted: (data) => {
      setAction('delete', 'location', data.deleteUmitLocation.id, data.deleteUmitLocation.name);
      router.reload();
    },
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('umit');
  const [showLocation, setShowLocation] = useState('');
  const [newLocation, setNewLocation] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('umit');
  const [locationId, setLocationId] = useState('');

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

  function editLocation(id) {
    setLocationId(id);
    setNewLocation(true);
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
    <>
      <Head>
        <title>{t('locations')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <EntetePage>
        <h3>{t('locations')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          onClick={() => {
            setLocationId('');
            setNewLocation(true);
          }}
        />
      </EntetePage>

      <Confirm />
      {showLocation && (
        <LocationDetails
          open={!!showLocation}
          onClose={handleCloseShowLocation}
          id={showLocation}
        />
      )}
      {newLocation && (
        <LocationNew open={!!newLocation} onClose={() => setNewLocation(false)} id={locationId} />
      )}
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="umit/locations"
      />
      <Table
        columns={columns}
        data={data?.umitLocations}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'edit', action: editLocation },
          { type: 'view', action: viewLocation },
          { type: 'trash', action: deleteLocation },
        ]}
      />
    </>
  );
}
