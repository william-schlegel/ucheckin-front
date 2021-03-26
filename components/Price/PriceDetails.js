import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';

import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonCancel from '../Buttons/ButtonCancel';
import { DrawerFooter } from '../styles/Drawer';
import Loading from '../Loading';
import {
  Block,
  Form,
  FormBody,
  FormBodyFull,
  Label,
  Row,
  RowReadOnly,
} from '../styles/Card';
import { PRICE_QUERY } from './Queries';
import { formatDate } from '../DatePicker';
import { TableStyled } from '../License/LicensePrice';
import {formatMoney} from '../../lib/formatNumber';
import LicenseType from '../Tables/LicenseType';
import Badges from '../Tables/Badges';

const DefaultStyled = styled.div`
  display: block;
  background-color: var(--secondary);
  border-radius: 100px;
  color: white;
  width: 100%;
  text-align: center;
  margin: 0.25rem 0;
  padding: 3px;
`;

export default function PriceDetails({ open, onClose, id }) {
  const { loading, error, data } = useQuery(PRICE_QUERY, {
    variables: { id },
  });
  const { t, lang } = useTranslation('license');

  if (loading) return <Loading />;
  if (!data) return null;
  const price = data.LicensePrice;
  return (
    <Drawer onClose={onClose} open={open} title={t('price-details')}>
      <Form>
        <FormBody>
          <RowReadOnly>
            <Label>{t('valid-after')}</Label>
            <span>{formatDate(price.validAfter)}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('valid-until')}</Label>
            <span>{formatDate(price.validUntil)}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('created-by')}</Label>
            <span>{price.owner.name}</span>
          </RowReadOnly>
          <RowReadOnly>
            <Label>{t('created-the')}</Label>
            <span>{formatDate(price.creation)}</span>
          </RowReadOnly>
        </FormBody>
        <FormBodyFull>
          <Row>
            <Label>{t('observations')}</Label>
            <Block>{price.observation}</Block>
          </Row>
          <Row>
            <Label>{t('apply-to')}</Label>
            <Block>
              <Badges labels={price.users} />
            </Block>
            {price.default && <DefaultStyled>{t('default')}</DefaultStyled>}
          </Row>
          <Row>
            <TableStyled>
              <thead>
                <tr>
                  <th>{t('price')}</th>
                  <th>{t('by-month')}</th>
                  <th>{t('by-year')}</th>
                </tr>
              </thead>
              <tbody>
                {price?.items.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <LicenseType license={p.licenseType.id} />
                    </td>
                    <td>{formatMoney(p.monthly, lang)}</td>
                    <td>{formatMoney(p.yearly, lang)}</td>
                  </tr>
                ))}
              </tbody>
            </TableStyled>
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

PriceDetails.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
