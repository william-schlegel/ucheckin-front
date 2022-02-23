import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import Table, { useColumns } from '../Tables/Table';
import ValidityDate from '../Tables/ValidityDate';

export default function InvitationTable({ invitations, actionButtons }) {
  const { t } = useTranslation('application');
  const columns = useColumns(
    [
      ['id', 'id', 'hidden'],
      [t('common:email'), 'email'],
      [
        t('invitation-status'),
        'status',
        ({ cell: { value } }) => <InvitationStatus value={value} />,
      ],
      [t('updated'), 'updated', ({ cell: { value } }) => <ValidityDate value={value} noColor />],
    ],
    !!actionButtons
  );

  return (
    <>
      <Table columns={columns} data={invitations} actionButtons={actionButtons} withPagination />
    </>
  );
}

InvitationTable.propTypes = {
  invitations: PropTypes.array,
  actionButtons: PropTypes.array,
};

function InvitationStatus({ value }) {
  const { t } = useTranslation('application');
  return <span>{t(value)}</span>;
}

InvitationStatus.propTypes = {
  value: PropTypes.string,
};
