import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';

import { Gift } from 'react-feather';
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
  RowReadOnly,
} from '../styles/Card';
import { LICENSE_QUERY } from './Queries';
import ValidityDate from '../Tables/ValidityDate';
import { LicenseType } from '../Tables/LicenseType';
import { formatDate } from '../DatePicker';

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
          {data.License.trialLicense && (
            <RowReadOnly>
              <div style={{ marginRight: '1rem' }}>
                <Gift size={30} color="var(--secondary)" />
              </div>
              <span>{t('trial')}</span>
            </RowReadOnly>
          )}
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.License.owner.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('signal')}</Label>
            <span>{data.License.signal?.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('application')}</Label>
            <span>{data.License.application.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('validity')}</Label>
            <ValidityDate value={data.License.validity} />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('common:info')}</Label>
            <span>
              {t('purchase-info', {
                name: data.License.owner.name,
                dt: formatDate(data.License.purchaseDate),
                info: data.License.purchaseInformation,
              })}
            </span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('nb-area')}</Label>
            <span>{data.License.nbArea}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('common:license-model')}</Label>
            <LicenseType license={data.License.licenseType.id} />
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

LicenseDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
