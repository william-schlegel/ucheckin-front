import { useMutation, useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useState } from 'react';

import ButtonCancel from '../Buttons/ButtonCancel';
import NewButton from '../Buttons/ButtonNew';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import {
  Block,
  Form,
  FormBodyFull,
  FormHeader,
  FormTitle,
  Label,
  Row,
  RowReadOnly,
} from '../styles/Card';
import { LicenseType } from '../Tables/LicenseType';
import Switch from '../Tables/Switch';
import Table, { useColumns } from '../Tables/Table';
import UmixStatus from '../Tables/UmixStatus';
import ValidityDate from '../Tables/ValidityDate';
import NewPlaylistItem from './NewPlaylistItem';
import { ACTIVATE_PLAYLIST_UMIX, UMIX_QUERY } from './Queries';

export default function UmixDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(UMIX_QUERY, {
    variables: { id },
  });
  const [updatePlaylistActive] = useMutation(ACTIVATE_PLAYLIST_UMIX, {
    refetchQueries: [
      {
        query: UMIX_QUERY,
        variables: { id },
      },
    ],
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
  const playlistColumns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('type-signal'),
        'licenseType.id',
        ({ cell: { value } }) => <LicenseType license={value} />,
      ],
      [t('signal'), 'signal.name'],
      [
        t('play-at'),
        'playAt',
        ({ cell: { value } }) => <ValidityDate noColor value={value} withTime />,
      ],
      [t('duration'), 'duration', ({ cell: { value } }) => <div>{value} s</div>],
    ],
    false
  );

  const [showAdd, setShowAdd] = useState(false);

  if (loading) return <Loading />;
  if (!data) return null;

  return (
    <Drawer onClose={onClose} open={open} title={t('umix-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('umix')} <span>{data.umix.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('mac-address')}</Label>
            <span>{data.umix.macAddress}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('active')}</Label>
            <Switch
              value={data.umix.playlistActive}
              callBack={(newValue) =>
                updatePlaylistActive({ variables: { umixId: id, value: newValue } })
              }
            />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('common:description')}</Label>
            <span>{data.umix.description}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.umix.owner.name}</span>
          </RowReadOnly>
          <Row>
            <Block>
              <Label>{t('playlist')}</Label>
              <NewButton label={t('add-playlist')} onClick={() => setShowAdd(true)} />
            </Block>
            <Table columns={playlistColumns} data={data.umix.playlistItems} withPagination />
          </Row>
        </FormBodyFull>
      </Form>

      {showAdd && (
        <NewPlaylistItem
          ownerId={data.umix.owner.id}
          umixId={data.umix.id}
          onClose={() => setShowAdd(false)}
        />
      )}
      <Form>
        <FormBodyFull>
          <Row>
            <Label>{t('status')}</Label>
            <Table columns={statusColumns} data={data.umix.status} withPagination />
          </Row>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

UmixDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
