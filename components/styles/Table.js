import styled from 'styled-components';

const Table = styled.table`
  border-spacing: 0;
  width: 100%;
  border: 1px solid var(--offWhite);
  thead {
    font-weight: 500;
    font-size: 2rem;
  }
  td,
  th {
    border-bottom: 1px solid var(--offWhite);
    border-right: 1px solid var(--offWhite);
    padding: 10px 5px;
    position: relative;
    &:last-child {
      border-right: none;
      width: 150px;
    }
    .badge {
      margin-right: 3px;
      border: 1px solid var(--offWhite);
      border-radius: 1rem;
      padding: 0.5rem 1rem;
    }
  }
  tr {
    &:hover {
      background: var(--offWhite);
    }
  }
`;

export default Table;
