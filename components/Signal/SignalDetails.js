import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonCancel from '../Buttons/ButtonCancel';
import { DrawerFooter } from '../styles/Drawer';
import Loading from '../Loading';
import {
  Form,
  FormBodyFull,
  FormHeader,
  FormTitle,
  Label,
  RowFull,
  RowReadOnly,
} from '../styles/Card';
import ActionButton from '../Buttons/ActionButton';
import LicenseTable from '../License/LicenseTable';

const SIGNAL_QUERY = gql`
  query SIGNAL_QUERY($id: ID!) {
    Signal(where: { id: $id }) {
      id
      signal
      owner {
        id
        name
      }
      active
      validity
      licenses {
        id
        application {
          id
          name
        }
        signal {
          id
          signal
        }
        validity
      }
    }
  }
`;

export default function SignalDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(SIGNAL_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('signal');
  const router = useRouter();

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('signal-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('signal')} <span>{data.Signal.signal}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.Signal.owner.name}</span>
          </RowReadOnly>
          <RowFull>
            <Label>{t('license:licenses')}</Label>
            <LicenseTable licenses={data.Signal.licenses} />
          </RowFull>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

SignalDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
