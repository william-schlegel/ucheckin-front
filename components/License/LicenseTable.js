import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

export default function LicenseTable({ licenses, actionButtons }) {
  const { t } = useTranslation('license');
  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [t('application'), 'application.name'],
      [t('signal'), 'signal.name'],
      [
        t('validity'),
        'validity',
        ({ cell: { value } }) => <ValidityDate value={value} />,
      ],
    ],
    !!actionButtons
  );

  return (
    <>
      <Table columns={columns} data={licenses} actionButtons={actionButtons} />
    </>
  );
}

LicenseTable.propTypes = {
  licenses: PropTypes.array,
  actionButtons: PropTypes.array,
};
