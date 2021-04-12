import { useEffect, useReducer, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { Gift } from 'react-feather';

import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import LicenseDetails from './LicenseDetails';
import Switch from '../Tables/Switch';
import SearchField, { useFilter } from '../SearchField';
import { PAGINATION_QUERY, ALL_LICENSES_QUERY } from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import ValidityDate from '../Tables/ValidityDate';
import { FormHeader, FormTitle } from '../styles/Card';
import { LicenseType } from '../Tables/LicenseType';
import LicenseUpdate from './LicenseUpdate';
import { useUser } from '../User/Queries';

// calculate number of free & number of valid licenses
function licensesAnalysis(licenses) {
  if (!licenses) return [0, 0];
  const nbValid = licenses.reduce((cnt, item) => {
    if (item.valid) return cnt + 1;
    return cnt;
  }, 0);
  return [licenses.length, nbValid];
}

function reducer(state, action) {
  switch (action.type) {
    case 'analysis':
      return {
        ...state,
        totalLicenses: action.res[0],
        validLicense: action.res[1],
      };
    case 'used':
      return {
        ...state,
        licenses: action.res,
      };
    case 'pagination':
      return {
        ...state,
        count: action.count,
      };
    default:
      return state;
  }
}

export default function Licenses() {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    validLicense: 0,
    totalLicenses: 0,
    licenses: [],
    count: 1,
  });
  const page = parseInt(router.query.page) || 1;
  const { t } = useTranslation('license');
  const user = useUser();

  const [
    queryPagination,
    { error: errorPage, loading: loadingPage },
  ] = useLazyQuery(PAGINATION_QUERY, {
    onCompleted: (dataP) => {
      console.log(`dataP`, dataP);
      dispatch({ type: 'pagination', count: dataP.count.count });
    },
  });
  const [queryLicenses, { error, loading }] = useLazyQuery(ALL_LICENSES_QUERY, {
    ssr: false,
    onCompleted: (dataLic) => {
      const licenses = dataLic?.allLicenses || [];
      const resA = licensesAnalysis(licenses);
      dispatch({
        type: 'analysis',
        res: [...resA],
      });
      dispatch({ type: 'used', res: licenses });
    },
  });
  const [showLicense, setShowLicense] = useState('');
  const [selectedLicense, setSelectedLicense] = useState({});
  const [showUpdateLicense, setShowUpdateLicense] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('license');
  const searchFields = [
    { field: 'owner.name_contains_i', label: t('common:owner'), type: 'text' },
  ];
  const { showFilter, setShowFilter, filters, handleNewFilter } = useFilter();

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      first: perPage,
    };
    console.log(`filters`, filters);
    if (filters) variables.where = filters;
    queryPagination({ variables: filters });
    queryLicenses({ variables });
  }, [filters, queryPagination, queryLicenses, page]);

  function viewLicense(id) {
    if (id) setShowLicense(id);
  }
  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [
      t('trial'),
      'trialLicense',
      ({ cell: { value } }) =>
        value ? (
          <div
            style={{
              width: '100%',
              display: 'grid',
              placeItems: 'center',
              color: 'var(--secondary)',
            }}
          >
            <Gift />
          </div>
        ) : null,
    ],
    [t('associated-signal'), 'signal'],
    [t('associated-application'), 'application'],
    [t('common:owner'), 'owner'],
    [
      t('common:license-model'),
      'licenseType',
      ({ cell: { value } }) => <LicenseType license={value} />,
    ],
    [
      t('valid'),
      'valid',
      ({ cell: { value } }) => <Switch value={value} disabled />,
    ],
    [
      t('validity'),
      'validity',
      ({ cell: { value } }) => <ValidityDate value={value} />,
    ],
    // [t('count'), 'count', ({ cell: { value } }) => <Number value={value} />],
  ]);

  function handleCloseShowLicense() {
    setShowLicense('');
  }

  function handleCloseExtend(orderId) {
    setShowUpdateLicense(false);
    console.log(`orderId`, orderId);
    if (orderId) {
      router.push(`/order/${orderId}`);
    }
  }

  function extendLicense(licenseId) {
    const license = state.licenses.find((l) => l.id === licenseId);
    setSelectedLicense({
      licenseId,
      appId: license.application.id,
      signalId: license.signal?.id,
      ownerId: license.owner.id,
    });
    setShowUpdateLicense(true);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  return (
    <>
      <Head>
        <title>{t('licenses')}</title>
      </Head>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      {showLicense && (
        <LicenseDetails
          open={!!showLicense}
          onClose={handleCloseShowLicense}
          id={showLicense}
        />
      )}
      {selectedLicense.licenseId && (
        <LicenseUpdate
          open={showUpdateLicense}
          onClose={handleCloseExtend}
          licenseId={selectedLicense.licenseId}
          appId={selectedLicense.appId}
          ownerId={selectedLicense.ownerId}
          signalId={selectedLicense.signalId}
        />
      )}
      <EntetePage>
        <h3>{t('licenses')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
      </EntetePage>
      <FormHeader>
        <FormTitle>
          {t('available-licenses')}
          <span>
            {t('license-info', { count: state.totalLicenses })}&nbsp;
            {t('license-valid', {
              count: state.validLicense,
            })}
          </span>
        </FormTitle>
      </FormHeader>
      <Pagination
        page={page}
        error={errorPage}
        loading={loadingPage}
        count={state.count}
        pageRef="licenses"
        withFilter
        setShowFilter={setShowFilter}
      />
      <SearchField
        fields={searchFields}
        showFilter={showFilter}
        onClose={() => setShowFilter(false)}
        onFilterChange={handleNewFilter}
        isAdmin={user.role?.canManageLicense}
      />
      <Table
        columns={columns}
        data={state.licenses.map((l) => ({
          id: l.id,
          trialLicense: l.trialLicense,
          signal: l.signal?.name,
          application: l.application.name,
          owner: l.owner.name,
          licenseType: l.licenseType.id,
          valid: l.valid,
          validity: l.validity,
        }))}
        error={error}
        loading={loading}
        actionButtons={[
          { type: 'view', action: viewLicense },
          { type: 'extend', action: extendLicense },
        ]}
      />
    </>
  );
}
