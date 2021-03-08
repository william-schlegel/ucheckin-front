import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import useTranslation from 'next-translate/useTranslation';

import TableStyle from './styles/Table';
import DisplayError from './ErrorMessage';
import Loading from './Loading';
import ActionButton from './Buttons/ActionButton';
import Badge from './styles/Badge';

export function useColumns(columns) {
  const { t } = useTranslation('common');
  const tableColumns = useMemo(
    () => columns.map((col) => ({ Header: col[0], accessor: col[1] })),
    [columns]
  );
  return [
    ...tableColumns,
    { Header: t('actions'), accessor: 'action-buttons' },
  ];
}

export default function Table({
  columns = [],
  data = [],
  error,
  loading,
  actionButtons,
}) {
  const hiddenColumns = useMemo(() => {
    const colId = columns.findIndex((c) => c.accessor === 'id');
    if (colId >= 0) return ['id'];
    return [];
  }, [columns]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data, initialState: { hiddenColumns } });

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;

  return (
    <TableStyle {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                if (cell.column.id === 'action-buttons') {
                  return (
                    <td {...cell.getCellProps()}>
                      {actionButtons.map((actionButton) => (
                        <ActionButton
                          key={actionButton.type}
                          type={actionButton.type}
                          cb={() => actionButton.action(row.allCells[0].value)}
                        />
                      ))}
                    </td>
                  );
                }
                if (cell.column.id === 'users') {
                  return (
                    <td {...cell.getCellProps()}>
                      {row.original.users.map((user) => (
                        <Badge key={user.id}>{user.name}</Badge>
                      ))}
                    </td>
                  );
                }
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </TableStyle>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  error: PropTypes.object,
  loading: PropTypes.bool,
  actionButtons: PropTypes.arrayOf(PropTypes.object),
};
