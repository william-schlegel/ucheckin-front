import { useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { CheckCircle } from 'react-feather';

import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import PriceDetails from './PriceDetails';
import PriceNew from './PriceNew';
import SearchField, { useFilter } from '../SearchField';
import { PAGINATION_PRICE_QUERY, ALL_PRICES_QUERY } from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import ValidityDate from '../Tables/ValidityDate';
import Badges from '../Tables/Badges';
import ButtonNew from '../Buttons/ButtonNew';
import { useUser } from '../User/Queries';

export default function Prices() {
  const router = useRouter();
  const user = useUser();

  const [
    queryPagination,
    { error: errorPage, loading: loadingPage, data: dataPage },
  ] = useLazyQuery(PAGINATION_PRICE_QUERY);
  const [queryPrices, { error, loading, data }] = useLazyQuery(
    ALL_PRICES_QUERY
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('license');

  const [showPrice, setShowPrice] = useState('');
  const [newPrice, setNewPrice] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp(
    'license-price'
  );

  const searchFields = [
    { field: 'owner.name_contains_i', label: t('common:owner'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      first: perPage,
    };
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryPrices({ variables });
  }, [filters, queryPagination, queryPrices, page]);

  function viewPrice(id) {
    if (id) setShowPrice(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [
      t('default'),
      'default',
      ({ cell: { value } }) => (value ? <Check /> : null),
    ],
    [
      t('users'),
      'users',
      ({ cell: { value } }) => <Badges labels={value} />, // value.map((u) => <Badge label={u.name} />),
    ],
    [
      t('valid-after'),
      'validAfter',
      ({ cell: { value } }) => <ValidityDate value={value} after />,
    ],
    [
      t('valid-until'),
      'validUntil',
      ({ cell: { value } }) => <ValidityDate value={value} />,
    ],
  ]);

  function handleCloseShowPrice() {
    setShowPrice('');
  }

  function handleCloseNewPrice() {
    setNewPrice(false);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('license-prices')}</title>
      </Head>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      {showPrice && (
        <PriceDetails
          open={!!showPrice}
          onClose={handleCloseShowPrice}
          id={showPrice}
        />
      )}
      {newPrice && <PriceNew open={newPrice} onClose={handleCloseNewPrice} />}
      <EntetePage>
        <h3>{t('license-prices')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          onClick={() => {
            setNewPrice(true);
          }}
        />
      </EntetePage>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={count}
        pageRef="price"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManagePrice}
      />
      <Table
        columns={columns}
        data={data?.allLicensePrices}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'view', action: viewPrice }]}
      />
    </>
  );
}

function Check() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <CheckCircle style={{ color: 'green' }} />
    </div>
  );
}
