import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ButtonCancel from '../Buttons/ButtonCancel';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Form, FormBodyFull, FormHeader, FormTitle, Label, RowReadOnly } from '../styles/Card';
import { LOCATION_QUERY } from './Queries';

export default function LocationDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(LOCATION_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('umit');

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('location-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('location')} <span>{data.umitLocation.name}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('company')}</Label>
            <span>{data.umitLocation.company}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('address')}</Label>
            <span>{data.umitLocation.address}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('zip-code')}</Label>
            <span>{data.umitLocation.zipCode}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('city')}</Label>
            <span>{data.umitLocation.city}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('country')}</Label>
            <span>{data.umitLocation.country}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('contact')}</Label>
            <span>{data.umitLocation.contact}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('telephone')}</Label>
            <span>{data.umitLocation.telephone}</span>
          </RowReadOnly>
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

LocationDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
