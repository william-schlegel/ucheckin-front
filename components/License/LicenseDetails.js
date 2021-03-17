import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';

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
import LicenseTable from './LicenseTable';
import { LICENSE_QUERY } from './Queries';

export default function LicenseDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(LICENSE_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('license');

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('license-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('license')} <span>{data.License.license}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.License.owner.name}</span>
          </RowReadOnly>
          <RowFull>
            <Label>{t('license:licenses')}</Label>
            <LicenseTable licenses={data.License.licenses} />
          </RowFull>
        </FormBodyFull>
      </Form>
      <p>&nbsp;</p>
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

LicenseDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
