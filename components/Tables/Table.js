import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useTable } from 'react-table';
import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

import TableStyle from '../styles/Table';
import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import ActionButton from '../Buttons/ActionButton';
import NoData from './NoData';

export function useColumns(columns, action = true) {
  const { t } = useTranslation('common');
  const tableColumns = useMemo(
    () =>
      columns.map((col) => {
        const [header, accessor, component, options] = col;
        const colDef = {
          Header: header,
          accessor,
          options: {},
          customRender: false,
        };

        if (component) {
          if (typeof component === 'string') {
            colDef.options = component;
          } else {
            colDef.Cell = component;
            colDef.customRender = true;
          }
        }
        if (options) colDef.options = options;
        return colDef;
      }),
    [columns]
  );
  if (action)
    return [
      ...tableColumns,
      {
        Header: t('actions'),
        options: { ui: 'action-buttons' },
      },
    ];
  return tableColumns;
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
      .filter((c) => c?.options === 'hidden')
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
  if (!data.length) return <NoData />;

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
                if (cell.column.customRender) {
                  // console.log(`cell`, cell);
                  // console.log(`row`, row);
                  return (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  );
                }
                if (
                  Array.isArray(actionButtons) &&
                  actionButtons.length &&
                  cell.column.options.ui === 'action-buttons'
                ) {
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
  data: PropTypes.arrayOf(PropTypes.object),
  error: PropTypes.object,
  loading: PropTypes.bool,
  actionButtons: PropTypes.arrayOf(PropTypes.object),
};
