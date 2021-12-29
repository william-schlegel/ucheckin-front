import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  border: 1px solid var(--off-white);
  margin-bottom: 1rem;
  thead {
    font-weight: 500;
  }
  td,
  th {
    border-bottom: 1px solid var(--off-white);
    border-right: 1px solid var(--off-white);
    padding: 10px 5px;
    position: relative;
    &:last-child {
      border-right: none;
      width: 150px;
    }
  }
  tr {
    &:hover {
      background: var(--off-white);
    }
  }
  @media print {
    font-size: 10px;
    margin-bottom: 0;
    table {
      page-break-inside: auto;
    }
    tr {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    td {
      page-break-inside: avoid;
      page-break-after: auto;
    }
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
    td,
    th {
      padding: 5px;
    }
  }
`;

export default Table;
