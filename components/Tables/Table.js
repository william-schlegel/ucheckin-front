/* eslint-disable react/jsx-key */
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'react-feather';
import { usePagination, useTable } from 'react-table';
import styled from 'styled-components';

import DisplayError from '../ErrorMessage';
import Loading from '../Loading';
import TableStyle from '../styles/Table';
import ActionButtons from './ActionButtons';
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

function TableWithoutPagination({ columns, data, hiddenColumns, actionButtons }) {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data,
    initialState: { hiddenColumns },
  });

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
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                }
                if (
                  Array.isArray(actionButtons) &&
                  actionButtons.length &&
                  cell.column.options.ui === 'action-buttons'
                ) {
                  return (
                    <td {...cell.getCellProps()}>
                      <ActionButtons actionButtons={actionButtons} values={cell.row.values} />
                    </td>
                  );
                }
                // console.log(`cell`, cell);
                return (
                  <td {...cell.getCellProps()}>
                    {cell.render('Cell')}
                    {cell.column.options.unit ? ` ${cell.column.options.unit}` : ''}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </TableStyle>
  );
}

TableWithoutPagination.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  actionButtons: PropTypes.arrayOf(PropTypes.object),
  hiddenColumns: PropTypes.array,
};

function TableWithPagination({ columns, data, hiddenColumns, actionButtons, rowPerPage }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { hiddenColumns, pageIndex: 0, pageSize: rowPerPage },
    },
    usePagination
  );

  return (
    <>
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
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  if (cell.column.customRender) {
                    // console.log(`cell`, cell);
                    // console.log(`row`, row);
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  }
                  if (
                    Array.isArray(actionButtons) &&
                    actionButtons.length &&
                    cell.column.options.ui === 'action-buttons'
                  ) {
                    return (
                      <td {...cell.getCellProps()}>
                        <ActionButtons actionButtons={actionButtons} values={cell.row.values} />
                      </td>
                    );
                  }
                  // console.log(`cell`, cell);
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                      {cell.column.options.unit ? ` ${cell.column.options.unit}` : ''}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </TableStyle>
      <TablePagination
        page={pageIndex}
        canPreviousPage={canPreviousPage}
        canNextPage={canNextPage}
        pageCount={pageCount}
        gotoPage={gotoPage}
        nextPage={nextPage}
        previousPage={previousPage}
      />
    </>
  );
}

TableWithPagination.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  actionButtons: PropTypes.arrayOf(PropTypes.object),
  hiddenColumns: PropTypes.array,
  rowPerPage: PropTypes.number,
};

export default function Table({
  columns = [],
  data = [],
  error,
  loading,
  actionButtons,
  withPagination,
  rowPerPage,
}) {
  const hiddenColumns = useMemo(() => {
    const hiddenCols = columns.filter((c) => c?.options === 'hidden').map((c) => c.accessor);
    return hiddenCols;
  }, [columns]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (!data.length) return <NoData />;

  if (withPagination) {
    return (
      <TableWithPagination
        columns={columns}
        data={data}
        hiddenColumns={hiddenColumns}
        actionButtons={actionButtons}
        rowPerPage={rowPerPage}
      />
    );
  }
  return (
    <TableWithoutPagination
      columns={columns}
      data={data}
      hiddenColumns={hiddenColumns}
      actionButtons={actionButtons}
    />
  );
}

Table.defaultProps = {
  withPagination: false,
  rowPerPage: 5,
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object).isRequired,
  data: PropTypes.arrayOf(PropTypes.object),
  error: PropTypes.object,
  loading: PropTypes.bool,
  actionButtons: PropTypes.arrayOf(PropTypes.object),
  withPagination: PropTypes.bool,
  rowPerPage: PropTypes.number,
};

function TablePagination({
  page,
  canPreviousPage,
  canNextPage,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
}) {
  const { t } = useTranslation('common');
  if (pageCount <= 1) return null;
  console.log(`pageCount`, { page, pageCount });
  return (
    <PaginationContainer>
      <button type="button" disabled={!!(page <= 0)} onClick={() => gotoPage(0)}>
        <ChevronsLeft />
      </button>
      <button type="button" disabled={!canPreviousPage} onClick={() => previousPage()}>
        <ChevronLeft />
      </button>
      <span>{t('pagination', { page: page + 1, cnt: pageCount })}</span>
      <button type="button" disabled={!canNextPage} onClick={() => nextPage()}>
        <ChevronRight />
      </button>
      <button
        type="button"
        disabled={!!(page >= pageCount - 1)}
        onClick={() => gotoPage(pageCount - 1)}
      >
        <ChevronsRight />
      </button>
    </PaginationContainer>
  );
}

TablePagination.propTypes = {
  page: PropTypes.number,
  canPreviousPage: PropTypes.bool,
  canNextPage: PropTypes.bool,
  pageCount: PropTypes.number,
  gotoPage: PropTypes.func,
  nextPage: PropTypes.func,
  previousPage: PropTypes.func,
};

const PaginationContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  button {
    border: none;
    outline: none;
    background-color: transparent;
    color: var(--primary);
    transition: transform 300ms ease-in-out;
    &:hover {
      color: var(--secondary);
      transform: scale(1.2);
    }

    &[aria-disabled='true'],
    &[disabled] {
      color: grey;
      pointer-events: none;
    }
  }
  span {
    height: 100%;
  }
`;
