import styled from 'styled-components';

const Box = styled.div`
  text-align: center;
  display: inline-grid;
  align-items: stretch;
  justify-content: center;
  align-content: center;
  margin: 0.5rem 0;
  border: 1px solid var(--lightGrey);
  border-radius: 10px;
  & > * {
    margin: 0;
    padding: 15px 30px;
    border-right: 1px solid var(--lightGrey);
    &:last-child {
      border-right: 0;
    }
  }
  a[aria-disabled='true'] {
    color: grey;
    pointer-events: none;
  }
`;

export const PaginationStyles = styled(Box)`
  grid-template-columns: repeat(4, auto);
  margin-right: 1rem;
`;

export const SearchFilterStyles = styled(Box)`
  display: inline-flex;
  justify-content: flex-start;
  & > * {
    padding: 10px 10px;
  }
`;
