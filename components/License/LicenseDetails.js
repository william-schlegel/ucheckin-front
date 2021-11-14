import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { Gift } from 'react-feather';

import ButtonCancel from '../Buttons/ButtonCancel';
import { formatDate } from '../DatePicker';
import Drawer, { DrawerFooter } from '../Drawer';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import { Form, FormBodyFull, FormHeader, FormTitle, Label, Row, RowReadOnly } from '../styles/Card';
import { LicenseType } from '../Tables/LicenseType';
import Number from '../Tables/Number';
import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';
import { LICENSE_QUERY } from './Queries';

export default function LicenseDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(LICENSE_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('license');
  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [
        t('date-purchase'),
        'invoice.orderDate',
        ({ cell: { value } }) => <ValidityDate noColor value={value} />,
      ],
      [t('common:name'), 'name'],
      [t('quantity'), 'quantity', ({ cell: { value } }) => <Number value={value} />],
      [t('nb-area'), 'nbArea', ({ cell: { value } }) => <Number value={value} />],
    ],
    false
  );

  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <Drawer onClose={onClose} open={open} title={t('license-details')}>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('license')} <span>{data.license.license}</span>
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          {data.license.trialLicense && (
            <RowReadOnly>
              <div style={{ marginRight: '1rem' }}>
                <Gift size={30} color="var(--secondary)" />
              </div>
              <span>{t('trial')}</span>
            </RowReadOnly>
          )}
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.license.owner.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('signal')}</Label>
            <span>{data.license.signal?.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('application')}</Label>
            <span>{data.license.application.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('validity')}</Label>
            <ValidityDate value={data.license.validity} />
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('common:info')}</Label>
            <span>
              {t('purchase-info', {
                name: data.license.owner.name,
                dt: formatDate(data.license.purchaseDate),
                info: data.license.purchaseInformation,
              })}
            </span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('nb-area')}</Label>
            <span>{data.license.nbArea}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('common:license-model')}</Label>
            <LicenseType license={data.license.licenseType.id} />
          </RowReadOnly>
          <Row>
            <Label>{t('invoice-history')}</Label>
            <Table columns={columns} data={data.license.orderItems} withPagination />
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

LicenseDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
