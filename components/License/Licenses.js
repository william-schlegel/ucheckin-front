import { useEffect, useReducer, useRef, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import Pagination from '../Pagination';
import Table, { useColumns } from '../Tables/Table';
import { perPage } from '../../config';
import Loading from '../Loading';
import DisplayError from '../ErrorMessage';
import EntetePage from '../styles/EntetePage';
import LicenseDetails from './LicenseDetails';
import Switch from '../Tables/Switch';
import SearchField, { useSearch } from '../SearchField';
import { PAGINATION_QUERY, ALL_LICENSES_QUERY } from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import ValidityDate from '../Tables/ValidityDate';
import { Form, FormBodyFull, FormHeader, FormTitle } from '../styles/Card';
import { formatDate } from '../DatePicker';
import LicenseType from '../Tables/LicenseType';
import Number from '../Tables/Number';
import LicenseUpdate from './LicenseUpdate';

// calculate number of free & number of valid licenses
function licensesAnalysis(licenses) {
  if (!licenses) return [0, 0];
  const nbValid = licenses.reduce((cnt, item) => {
    if (item.valid) return cnt + 1;
    return cnt;
  }, 0);
  return [licenses.length, nbValid];
}

// aggregate licenses
function aggregateLicenses(licenses) {
  if (!licenses) return [[], []];
  const used = new Map();

  function compare(map, key, item) {
    if (map.has(key)) {
      const lic = map.get(key);
      if (
        lic.validity === item.validity &&
        lic.owner.id === item.owner.id &&
        lic.licenseType.id === item.licenseType.id
      ) {
        lic.count += 1;
        map.set(key, lic);
        return;
      }
    }
    map.set(key, { item, count: 1 });
  }

  licenses.forEach((l) => {
    compare(used, l.signal, l);
  });
  const dataUsed = Array.from(used).map((l) => ({
    id: l[1].item.id,
    signal: l[1].item.signal.name,
    signalId: l[1].item.signal.id,
    application: l[1].item.application.name,
    appId: l[1].item.application.id,
    owner: l[1].item.owner.name,
    ownerId: l[1].item.owner.id,
    valid: l[1].item.valid,
    validity: l[1].item.validity,
    licenseType: l[1].item.licenseType.id,
    purchaseInfo: {
      dt: formatDate(l[1].item.purchaseDate),
      info: l[1].item.purchaseInformation,
    },
    count: l[1].count,
  }));

  return dataUsed;
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
    default:
      return state;
  }
}

export default function Licenses() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('license');
  const [state, dispatch] = useReducer(reducer, {
    validLicense: 0,
    totalLicenses: 0,
    licenses: [],
  });

  const [findLicenses, { error, loading }] = useLazyQuery(ALL_LICENSES_QUERY, {
    ssr: false,
    onCompleted: (dataLic) => {
      const licenses = dataLic?.allLicenses || [];
      const resA = licensesAnalysis(licenses);
      dispatch({
        type: 'analysis',
        res: [...resA],
      });
      const resU = aggregateLicenses(licenses);
      dispatch({ type: 'used', res: resU });
    },
  });
  const [showLicense, setShowLicense] = useState('');
  const [selectedLicense, setSelectedLicense] = useState({});
  const [showUpdateLicense, setShowUpdateLicense] = useState(false);
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('license');
  const searchFields = useRef([
    { field: 'owner', label: t('common:owner'), type: 'text' },
  ]);
  const {
    filters,
    setFilters,
    handleChange,
    showFilter,
    setShowFilter,
    resetFilters,
  } = useSearch(searchFields.current);

  useEffect(() => {
    const variables = {
      skip: (page - 1) * perPage,
      first: perPage,
    };
    if (filters.owner) variables.owner = filters.owner;
    findLicenses({
      variables,
    });
  }, [filters, page, findLicenses]);

  function viewLicense(id) {
    if (id) setShowLicense(id);
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
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
    [t('count'), 'count', ({ cell: { value } }) => <Number value={value} />],
  ]);

  function handleCloseShowLicense() {
    setShowLicense('');
  }

  function extendLicense(licenseId) {
    const license = state.licenses.find((l) => l.id === licenseId);
    setSelectedLicense({
      licenseId,
      appId: license.appId,
      signalId: license.signalId,
      ownerId: license.ownerId,
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
          onClose={() => setShowUpdateLicense(false)}
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
      <Form>
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
        <FormBodyFull>
          {state.licenses.length > 0 && (
            <>
              <Pagination
                page={page}
                error={errorPage}
                loading={loadingPage}
                count={count}
                pageRef="licenses"
                withFilter
                setShowFilter={setShowFilter}
              />
              <SearchField
                fields={searchFields.current}
                setShowFilter={setShowFilter}
                showFilter={showFilter}
                filters={filters}
                setFilters={setFilters}
                handleChange={handleChange}
                query={ALL_LICENSES_QUERY}
                loading={loading}
                resetFilters={resetFilters}
              />
              <Table
                columns={columns}
                data={state.licenses}
                error={error}
                loading={loading}
                actionButtons={[
                  { type: 'view', action: viewLicense },
                  { type: 'extend', action: extendLicense },
                ]}
              />
            </>
          )}
        </FormBodyFull>
      </Form>
    </>
  );
}
