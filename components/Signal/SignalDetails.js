import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';

import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonCancel from '../Buttons/ButtonCancel';
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
import LicenseTable from '../License/LicenseTable';
import { SIGNAL_QUERY } from './Queries';
import SignalFiles from './SignalFiles';

export default function SignalDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(SIGNAL_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('signal');

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('signal-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('signal')} <span>{data.signal.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.signal.owner.name}</span>
          </RowReadOnly>
          <RowFull>
            <Label>{t('license:licenses')}</Label>
            <LicenseTable licenses={data.signal.licenses} />
          </RowFull>
        </FormBodyFull>
      </Form>
      <SignalFiles
        signalId={id}
        signalCode={data.signal.name}
        files={data.signal.files}
      />
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
