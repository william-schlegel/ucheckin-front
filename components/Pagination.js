import Link from 'next/link';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

import PaginationStyles from './styles/PaginationStyles';
import DisplayError from './ErrorMessage';
import { perPage } from '../config';

export default function Pagination({ page, error, loading, count, pageRef }) {
  const { t } = useTranslation('common');

  if (loading) return 'Loading...';
  if (error) return <DisplayError error={error} />;
  const pageCount = Math.ceil(count / perPage);
  return (
    <PaginationStyles>
      <Link href={`/${pageRef}/${page - 1}`}>
        <a aria-disabled={page <= 1}>← {t('prev')}</a>
      </Link>
      <p>{t('pagecount', { page, count: pageCount })}</p>
      <p> {t('itemcount', { count })}</p>
      <Link href={`/${pageRef}/${page + 1}`}>
        <a aria-disabled={page >= pageCount}>{t('next')} →</a>
      </Link>
    </PaginationStyles>
  );
}

Pagination.propTypes = {
  page: PropTypes.number,
  error: PropTypes.object,
  loading: PropTypes.bool,
  count: PropTypes.number,
  pageRef: PropTypes.string,
};
