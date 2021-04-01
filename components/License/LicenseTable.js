import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { LicenseType } from '../Tables/LicenseType';
import Number from '../Tables/Number';

import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

export default function LicenseTable({ licenses, actionButtons }) {
  const { t } = useTranslation('license');
  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [t('application'), 'application.name'],
      [
        t('common:license-type'),
        'licenseType.id',
        ({ cell: { value } }) => <LicenseType license={value} />,
      ],
      [t('signal'), 'signal.name'],
      [
        t('nb-area'),
        'nbArea',
        ({ cell: { value } }) => <Number value={value} />,
      ],
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
      <Table
        columns={columns}
        data={licenses}
        actionButtons={actionButtons}
        withPagination
      />
    </>
  );
}

LicenseTable.propTypes = {
  licenses: PropTypes.array,
  actionButtons: PropTypes.array,
};
