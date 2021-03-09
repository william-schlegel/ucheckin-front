import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';
import Switch from 'react-switch';

import TableStyle from './styles/Table';
import DisplayError from './ErrorMessage';
import Loading from './Loading';
import ActionButton from './Buttons/ActionButton';
import Badge from './styles/Badge';
import { getLicenseName } from '../lib/fixedLists';
import { formatDate } from './DatePicker';
import { ButtonStyled } from './styles/Button';

export function useColumns(columns) {
  const { t } = useTranslation('common');
  const tableColumns = useMemo(
    () =>
      columns.map((col) => ({
        Header: col[0],
        accessor: col[1],
        options: col[2] || {},
      })),
    [columns]
  );
  return [
    ...tableColumns,
    {
      Header: t('actions'),
      accessor: 'action-buttons',
      options: { ui: 'action-buttons' },
    },
  ];
}

const ActionButtonsStyled = styled.div`
  display: flex;
  a {
    display: inline;
  }
`;
export default function Table({
  columns = [],
  data = [],
  error,
  loading,
  actionButtons,
}) {
  const hiddenColumns = useMemo(() => {
    const hiddenCols = columns
      .filter((c) => c?.options?.ui === 'hidden')
      .map((c) => c.accessor);
    return hiddenCols;
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
                if (cell.column.options.ui === 'action-buttons') {
                  return (
                    <td {...cell.getCellProps()}>
                      <ActionButtonsStyled>
                        {actionButtons.map((actionButton) => (
                          <ActionButton
                            key={actionButton.type}
                            type={actionButton.type}
                            cb={() =>
                              actionButton.action(row.allCells[0].value)
                            }
                          />
                        ))}
                      </ActionButtonsStyled>
                    </td>
                  );
                }
                if (cell.column.options?.ui === 'badge') {
                  return (
                    <td {...cell.getCellProps()}>
                      <Badge>{cell.value}</Badge>
                    </td>
                  );
                }
                if (cell.column.options.ui === 'button') {
                  return (
                    <td {...cell.getCellProps()}>
                      <ButtonStyled
                        onClick={() =>
                          cell.column.options.action(row.allCells[0].value)
                        }
                      >
                        {cell.value}
                      </ButtonStyled>
                    </td>
                  );
                }
                if (cell.column.options.ui === 'badges') {
                  return (
                    <td {...cell.getCellProps()}>
                      {row.original.users.map((user) => (
                        <Badge key={user.id}>{user.name}</Badge>
                      ))}
                    </td>
                  );
                }
                if (cell.column.options.ui === 'license') {
                  return (
                    <td {...cell.getCellProps()}>
                      {getLicenseName(cell.value)}
                    </td>
                  );
                }
                if (cell.column.options.ui === 'date') {
                  return (
                    <td {...cell.getCellProps()}>{formatDate(cell.value)}</td>
                  );
                }
                if (cell.column.options.ui === 'checkbox') {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{ textAlign: 'center' }}
                    >
                      <Switch
                        onChange={() =>
                          cell.column.options.action(row.allCells[0].value)
                        }
                        checked={cell.value}
                        disabled={cell.column.options.disabled}
                      />
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
