import { useMutation, useQuery } from '@apollo/client';
import isEmpty from 'lodash.isempty';
import Head from 'next/head';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useRef } from 'react';

import { perPage } from '../../config';
import useAction from '../../lib/useAction';
import useForm from '../../lib/useForm';
import ButtonCancel from '../Buttons/ButtonCancel';
import ButtonDelete from '../Buttons/ButtonDelete';
import NewButton from '../Buttons/ButtonNew';
import ValidationButton from '../Buttons/ButtonValidation';
import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import FieldError from '../FieldError';
import Loading from '../Loading';
import { SearchUser } from '../SearchUser';
import {
  Block,
  Form,
  FormBody,
  FormBodyFull,
  FormFooter,
  FormHeader,
  FormTitle,
  Label,
  Row,
  RowReadOnly,
} from '../styles/Card';
import { LicenseType } from '../Tables/LicenseType';
import Table, { useColumns } from '../Tables/Table';
import UmixRT from '../Tables/UmixRT';
import UmixStatus from '../Tables/UmixStatus';
import ValidityDate from '../Tables/ValidityDate';
import { useUser } from '../User/Queries';
import NewPlaylistItem from './NewPlaylistItem';
import {
  ALL_UMIXES_QUERY,
  DELETE_PLAYLIST_ITEM,
  DELETE_UMIX_MUTATION,
  UMIX_QUERY,
  UPDATE_UMIX_MUTATION,
} from './Queries';

export default function Umix({ id, initialData }) {
  const { user } = useUser();
  const router = useRouter();
  const { loading, error, data } = useQuery(UMIX_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('umix');
  const statusColumns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [t('status'), 'status', ({ cell: { value } }) => <UmixStatus status={value} noChange />],
      [
        t('modification-date'),
        'modificationDate',
        ({ cell: { value } }) => <ValidityDate noColor value={value} withTime />,
      ],
    ],
    false
  );
  const playlistColumns = useColumns([
    ['id', 'id', 'hidden'],
    [t('type-signal'), 'licenseType.id', ({ cell: { value } }) => <LicenseType license={value} />],
    [t('signal'), 'signal.name'],
    [
      t('play-at'),
      'playAt',
      ({ cell: { value } }) => <ValidityDate noColor value={value} withTime />,
    ],
    [t('duration'), 'duration', ({ cell: { value } }) => <div>{value} s</div>],
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const initialValues = useRef(initialData.data.umix);
  const { inputs, handleChange, validate, validationError, wasTouched } = useForm(
    initialValues.current,
    ['name', 'description']
  );
  const { setAction } = useAction();
  const [updateUmix, { loading: loadingUpdate, error: errorUpdate }] = useMutation(
    UPDATE_UMIX_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_UMIXES_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: (data) => {
        setAction('update', 'umix', data.updateUmix.id);
        router.push('/umixes');
      },
    }
  );
  const [deleteUmix, { loading: loadingDelete, error: errorDelete }] = useMutation(
    DELETE_UMIX_MUTATION,
    {
      variables: { id },
      refetchQueries: [
        {
          query: ALL_UMIXES_QUERY,
          variables: { skip: 0, take: perPage },
        },
      ],
      onCompleted: (data) => {
        setAction('delete', 'umix', data.deleteUmix.id, data.deleteUmix.name);
        router.push('/umixes');
      },
    }
  );

  const [deletePlaylistItemMutation] = useMutation(DELETE_PLAYLIST_ITEM, {
    refetchQueries: [
      {
        query: UMIX_QUERY,
        variables: { id },
      },
    ],
  });

  function handleValidation() {
    const newInputs = validate();
    if (!newInputs) return;
    // console.log('newInputs', newInputs);
    if (isEmpty(newInputs)) {
      router.push('/umixes');
      return;
    }
    if (wasTouched('owner.id')) newInputs.owner = { connect: { id: newInputs.owner.id } };
    const variables = {
      where: { id },
      data: { ...newInputs },
    };
    updateUmix({ variables });
  }

  function handleDelete() {
    const variables = {
      id,
      idPls: data.umix.playlistItems.map((p) => ({ id: p.id })),
      idStatus: data.umix.status.map((s) => ({ id: s.id })),
    };
    deleteUmix({ variables });
  }

  function deletePlaylistItem(id) {
    console.log('id', id);
    deletePlaylistItemMutation({ variables: { id } });
  }

  if (loading) return <Loading />;
  if (!data) return null;

  if (errorUpdate) return <DisplayError error={errorUpdate} />;
  if (errorDelete) return <DisplayError error={errorDelete} />;

  return (
    <>
      <Head>
        <title>
          UCheck In - {t('umix')} {inputs.name}
        </title>
      </Head>
      <Form>
        <FormHeader>
          <FormTitle> {t('umix')} </FormTitle>
        </FormHeader>
        <Drawer open={showAdd} onClose={() => setShowAdd(false)}>
          <NewPlaylistItem
            ownerId={inputs.owner?.id}
            umixId={inputs.id}
            onClose={() => setShowAdd(false)}
          />
        </Drawer>

        <FormBody>
          <RowReadOnly>
            <Label>{t('mac-address')}</Label>
            <span>{inputs.macAddress}</span>
          </RowReadOnly>
          <Row>
            <Label htmlFor="name" required>
              {t('common:name')}
            </Label>
            <input
              required
              type="text"
              id="name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
            <FieldError error={validationError.name} />
          </Row>
          <Row>
            <Label htmlFor="description" required>
              {t('common:description')}
            </Label>
            <input
              required
              type="text"
              id="description"
              name="description"
              value={inputs.description}
              onChange={handleChange}
            />
            <FieldError error={validationError.description} />
          </Row>
          {user.role?.canManageAllUmix ? (
            <Row>
              <Label>{t('common:owner')}</Label>
              <Block>
                <SearchUser
                  required
                  name="owner.id"
                  value={inputs.owner?.id}
                  onChange={handleChange}
                />
              </Block>
            </Row>
          ) : (
            <RowReadOnly>
              <Label>{t('common:owner')}</Label>
              <span>{inputs.owner?.name}</span>
            </RowReadOnly>
          )}
          <RowReadOnly>
            <Label>{t('connection-status')}</Label>
            <UmixRT umixId={id} />
          </RowReadOnly>
        </FormBody>
        <FormBodyFull>
          <Row>
            <Block>
              <Label>{t('playlist')}</Label>
              <NewButton label={t('add-playlist')} onClick={() => setShowAdd(true)} />
            </Block>
            <Table
              columns={playlistColumns}
              data={data.umix.playlistItems}
              withPagination
              actionButtons={[{ type: 'trash', action: deletePlaylistItem }]}
            />
          </Row>
        </FormBodyFull>
      </Form>
      <FormFooter>
        <ValidationButton disabled={loadingUpdate} onClick={handleValidation} />
        <ButtonDelete disabled={loadingDelete} onClick={handleDelete} />
        <ButtonCancel onClick={() => router.back()} />
        {error && <DisplayError error={error} />}
      </FormFooter>

      <Form>
        <FormBodyFull>
          <Row>
            <Label>{t('status')}</Label>
            <Table columns={statusColumns} data={inputs.status} withPagination />
          </Row>
        </FormBodyFull>
      </Form>
    </>
  );
}

Umix.propTypes = {
  id: PropTypes.string.isRequired,
  initialData: PropTypes.object,
};
