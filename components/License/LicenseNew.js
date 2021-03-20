import { useEffect, useRef, useState } from 'react';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';

import Counter from '../Counter';
import Drawer from '../Drawer';
import DisplayError from '../ErrorMessage';
import ButtonPayment from '../Buttons/ButtonPayment';
import ButtonCancel from '../Buttons/ButtonCancel';
import { ALL_LICENSES_QUERY, PAGINATION_QUERY } from './Queries';
import { DrawerFooter } from '../styles/Drawer';
import { FormBodyFull, Label, Row, Form, Block, H2 } from '../styles/Card';
import useForm from '../../lib/useForm';
import { perPage } from '../../config';
import { useUser } from '../User';
import ActionButton from '../Buttons/ActionButton';
import SearchUser from '../SearchUser';
import LicensePrice, { usePrice } from './LicensePrice';
import Total from '../TotalCount';

const CREATE_LICENSE_MUTATION = gql`
  mutation CREATE_LICENSE_MUTATION($data: [LicensesCreateInput]!) {
    createLicenses(data: $data) {
      id
    }
  }
`;

export default function LicenseNew({ open, onClose }) {
  const [createLicense, { loading, error }] = useMutation(
    CREATE_LICENSE_MUTATION,
    {
      refetchQueries: [
        {
          query: ALL_LICENSES_QUERY,
          variables: { skip: 0, first: perPage },
        },
        { query: PAGINATION_QUERY },
      ],
    }
  );
  const user = useUser();
  const { price } = usePrice(user?.id);
  const [total, setTotal] = useState(0);
  const { t } = useTranslation('license');
  const initialValues = useRef({
    owner: { key: user?.id, value: user?.name },
    ucheckInMonth: 0,
    ucheckInYear: 0,
    wiUsMonth: 0,
    wiUsYear: 0,
  });
  const { inputs, handleChange } = useForm(initialValues.current);
  const [editOwner, setEditOwner] = useState(false);

  function handleSubmit() {
    // TODO: handle payment before creating licenses
    const { owner, ucheckInMonth, ucheckInYear, wiUsMonth, wiUsYear } = inputs;
    const licenses = [];
    function createNLicenses(number, type) {
      for (let s = 0; s < number; s += 1)
        licenses.push({
          data: { owner: { connect: { id: owner.key } }, licenseType: type },
        });
      const variables = { data: licenses };
      createLicense({ variables }).catch((err) => alert(err.message));
    }
    onClose();
  }

  useEffect(() => {
    const { ucheckInMonth, ucheckInYear, wiUsMonth, wiUsYear } = inputs;
    const tot =
      parseInt(ucheckInMonth || 0) * parseFloat(price.ucheckInMonthly) +
      parseInt(ucheckInYear || 0) * parseFloat(price.ucheckInYearly) +
      parseInt(wiUsMonth || 0) * parseFloat(price.wiUsMonthly) +
      parseInt(wiUsYear || 0) * parseFloat(price.wiUsYearly);
    setTotal(tot);
  }, [inputs, price]);

  return (
    <Drawer onClose={onClose} open={open} title={t('new-license')}>
      <Form>
        <FormBodyFull>
          <Row>
            <Label>{t('common:owner')}</Label>
            <Block>
              <span>{inputs.owner.value}</span>
              {user?.role.canManageApplication && (
                <ActionButton type="edit" cb={() => setEditOwner(!editOwner)} />
              )}
              {user?.role.canManageLicense && editOwner && (
                <SearchUser
                  required
                  name="owner"
                  value={inputs.owner}
                  onChange={handleChange}
                />
              )}
            </Block>
          </Row>
          <Row>
            {user?.id && (
              <LicensePrice
                owner={user.id}
                dayDate={new Date().toISOString()}
              />
            )}
          </Row>
          <H2>{t('ucheck-in')}</H2>
          <Row>
            <Counter
              label={t('by-month')}
              name="ucheckInMonth"
              input={inputs.ucheckInMonth}
              handleChange={handleChange}
            />
            <Counter
              label={t('by-year')}
              name="ucheckInYear"
              input={inputs.ucheckInYear}
              handleChange={handleChange}
            />
          </Row>
          <H2>{t('wi-us')}</H2>
          <Row>
            <Counter
              label={t('by-month')}
              name="wiUsMonth"
              input={inputs.wiUsMonth}
              handleChange={handleChange}
            />
            <Counter
              label={t('by-year')}
              name="wiUsYear"
              input={inputs.wiUsYear}
              handleChange={handleChange}
            />
          </Row>
          <Total value={total} />
        </FormBodyFull>
      </Form>
      <DrawerFooter>
        <ButtonPayment disabled={loading || !total} onClick={handleSubmit} />
        <ButtonCancel onClick={onClose} />
        {error && <DisplayError error={error} />}
      </DrawerFooter>
    </Drawer>
  );
}

LicenseNew.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};
