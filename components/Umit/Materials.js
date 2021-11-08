import { useLazyQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useState } from 'react';

import { perPage } from '../../config';
import useConfirm from '../../lib/useConfirm';
import ButtonNew from '../Buttons/ButtonNew';
import DisplayError from '../ErrorMessage';
import { Help, HelpButton, useHelp } from '../Help';
import Loading from '../Loading';
import Pagination from '../Pagination';
import EntetePage from '../styles/EntetePage';
import Table, { useColumns } from '../Tables/Table';
import MaterialNew from './MaterialNew';
import {
  ALL_MATERIALS_QUERY,
  DELETE_MATERIAL_MUTATION,
  PAGINATION_MATERIAL_QUERY,
} from './Queries';

export default function Materials() {
  const router = useRouter();

  const [queryPagination, { error: errorPage, loading: loadingPage, data: dataPage }] =
    useLazyQuery(PAGINATION_MATERIAL_QUERY);
  const [queryMaterials, { error, loading, data }] = useLazyQuery(ALL_MATERIALS_QUERY);
  const [deleteMaterialMutation, { error: errorDelete }] = useMutation(DELETE_MATERIAL_MUTATION, {
    refetchQueries: [{ query: ALL_MATERIALS_QUERY }],
    onCompleted: () => router.reload(),
  });
  const page = parseInt(router.query.page) || 1;
  const count = dataPage?.count;
  const { t } = useTranslation('umit');
  const [newMaterial, setNewMaterial] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('umit');

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      take: perPage,
    };
    queryPagination();
    queryMaterials({ variables });
  }, [queryPagination, queryMaterials, page]);

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('company'), 'company'],
    [t('material-name'), 'name'],
    [
      t('prop-speed'),
      'propSpeed',
      ({ cell: { value } }) => (
        <div style={{ textAlign: 'right' }}>
          <span>{value}</span> m/s
        </div>
      ),
    ],
  ]);
  const { Confirm, setIsOpen, setArgs } = useConfirm({
    title: t('confirm-delete-material'),
    message: t('you-confirm'),
    yesLabel: t('yes-delete'),
    noLabel: t('no-delete'),
    callback: (args) => deleteMaterialMutation(args),
  });

  function deleteMaterial(id) {
    const material = data.umitMaterials.find((o) => o.id === id);
    if (!material) return;
    setArgs({ variables: { where: { id } } });
    setIsOpen(true);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;
  return (
    <>
      <Head>
        <title>{t('materials')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <EntetePage>
        <h3>{t('materials')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          onClick={() => {
            setNewMaterial(true);
          }}
        />
      </EntetePage>

      <Confirm />
      {newMaterial && <MaterialNew open={!!newMaterial} onClose={() => setNewMaterial(false)} />}
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="umit/materials"
      />

      <Table
        columns={columns}
        data={data?.umitMaterials}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'trash', action: deleteMaterial }]}
      />
    </>
  );
}
