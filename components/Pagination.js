import Link from 'next/link';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

import { PaginationStyles } from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';
import { ButtonStyled } from './styles/Button';
import ActionButton from './Buttons/ActionButton';

const PaginationBlock = styled.div`
  display: flex;
  align-items: center;
`;
export default function Pagination({
  page,
  error,
  loading,
  count,
  pageRef,
  withFilter,
  setShowFilter,
}) {
  const { t } = useTranslation('common');

  if (loading) return 'Loading...';
  if (error) return <DisplayError error={error} />;
  const pageCount = Math.ceil(count / perPage);
  return (
    <PaginationBlock>
      <PaginationStyles>
        <Link href={`/${pageRef}/${page - 1}`}>
          <a aria-disabled={page <= 1}>← {t('prev')}</a>
        </Link>
        <p>{t('pagecount', { page, count: pageCount })}</p>
        <p> {t(count > 1 ? 'itemcount_plural' : 'itemcount', { count })}</p>
        <Link href={`/${pageRef}/${page + 1}`}>
          <a aria-disabled={page >= pageCount}>{t('next')} →</a>
        </Link>
      </PaginationStyles>
      {withFilter && page <= 1 && (
        <ButtonStyled
          onClick={() => {
            setShowFilter(true);
          }}
        >
          <ActionButton
            type="search"
            cb={() => {
              setShowFilter(true);
            }}
          />
          {t('search-filter')}
        </ButtonStyled>
      )}
    </PaginationBlock>
  );
}

Pagination.propTypes = {
  page: PropTypes.number,
  error: PropTypes.object,
  loading: PropTypes.bool,
  count: PropTypes.number,
  pageRef: PropTypes.string,
  withFilter: PropTypes.bool,
  setShowFilter: PropTypes.func,
};
