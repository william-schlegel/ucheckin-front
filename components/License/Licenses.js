import { useEffect, useReducer, useRef, useState } from 'react';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
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
import ButtonNew from '../Buttons/ButtonNew';
import LicenseDetails from './LicenseDetails';
import LicenseNew from './LicenseNew';
import Switch from '../Tables/Switch';
import SearchField, { useSearch } from '../SearchField';
import {
  PAGINATION_QUERY,
  ALL_LICENSES_QUERY,
  ACTIVATE_TRIAL_MUTATION,
} from './Queries';
import { useHelp, Help, HelpButton } from '../Help';
import ValidityDate from '../Tables/ValidityDate';
import { ButtonStyled } from '../styles/Button';
import { Form, FormBodyFull, FormHeader, FormTitle } from '../styles/Card';
import { formatDate } from '../DatePicker';
import { useUser } from '../User';
import Spinner from '../Spinner';
import LicenseType from '../Tables/LicenseType';

// calculate number of free & number of valid licenses, find the trial license
function licensesAnalysis(licenses) {
  if (!licenses) return [0, 0, 0, null];
  const nbFree = licenses.reduce((cnt, item) => {
    if (!item.signal || !item.application) return cnt + 1;
    return cnt;
  }, 0);
  const nbValid = licenses.reduce((cnt, item) => {
    if (item.valid) return cnt + 1;
    return cnt;
  }, 0);
  const trial = licenses.find((l) => l.trialLicense);
  return [nbFree, nbValid, licenses.length, trial];
}

// aggregate licenses in 2 groups
function usedUnusedLicenses(licenses) {
  if (!licenses) return [[], []];
  const used = new Map();
  const unused = new Map();

  function compare(map, key, item) {
    if (map.has(key)) {
      const lic = map.get(key);
      if (
        lic.validity === item.validity &&
        lic.owner.id === item.owner.id &&
        lic.licenseType === item.licenseType
      ) {
        lic.count += 1;
        map.set(key, lic);
        return;
      }
    }
    map.set(key, { item, count: 1 });
  }

  licenses.forEach((l) => {
    const key = l?.signal || '-';
    if (l?.signal) {
      compare(used, key, l);
    } else {
      compare(unused, key, l);
    }
  });

  const dataUsed = Array.from(used).map((l) => ({
    signal: l[1].item.signal.signal,
    application: l[1].item.application.name,
    owner: l[1].item.owner.name,
    valid: l[1].item.valid,
    validity: l[1].item.validity,
    licenseType: l[1].item.licenseType,
    purchaseInfo: {
      name: l[1].item.purchaseBy.name,
      dt: formatDate(l[1].item.purchaseDate),
      info: l[1].item.purchaseInformation,
    },
    count: l[1].count,
  }));

  const dataUnused = Array.from(unused).map((l) => ({
    owner: l[1].item.owner.name,
    valid: l[1].item.valid,
    validity: l[1].item.validity,
    licenseType: l[1].item.licenseType,
    purchaseInfo: {
      name: l[1].item.purchaseBy.name,
      dt: formatDate(l[1].item.purchaseDate),
      info: l[1].item.purchaseInformation,
    },
    count: l[1].count,
  }));
  return [dataUsed, dataUnused];
}

function reducer(state, action) {
  switch (action.type) {
    case 'analysis':
      return {
        ...state,
        freeLicense: action.res[0],
        validLicense: action.res[1],
        totalLicenses: action.res[2],
        trialLicense: action.res[3],
      };
    case 'used':
      return {
        ...state,
        usedLicenses: action.res[0],
        unusedLicenses: action.res[1],
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
    freeLicense: 0,
    validLicense: 0,
    totalLicenses: 0,
    trialLicense: null,
    usedLicenses: [],
    unusedLicenses: [],
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
      const resU = usedUnusedLicenses(licenses);
      dispatch({ type: 'used', res: resU });
    },
  });
  const user = useUser();
  const [
    createTrial,
    { error: errorTrial, loading: loadingTrial },
  ] = useMutation(ACTIVATE_TRIAL_MUTATION);
  const [showLicense, setShowLicense] = useState('');
  const [newLicense, setNewLicense] = useState(false);
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

  function activateTrial() {
    const nowPlus3Months = new Date();
    nowPlus3Months.setMonth(nowPlus3Months.getMonth() + 3);
    createTrial({
      variables: {
        ownerId: user.id,
        dateValidite: nowPlus3Months.toISOString(),
        trialText: t('trial-text'),
      },
      refetchQueries: [
        {
          query: ALL_LICENSES_QUERY,
          variables: {
            skip: (page - 1) * perPage,
            first: perPage,
          },
        },
      ],
    });
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
    [t('count'), 'count'],
  ]);

  const columnsUnused = useColumns(
    [
      [
        t('purchase'),
        'purchaseInfo',
        ({ cell: { value } }) => <span>{t('purchase-info', value)}</span>,
      ],
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
      [t('count'), 'count'],
    ],
    false
  );

  function handleCloseShowLicense() {
    setShowLicense('');
  }
  function handleCloseNewLicense() {
    setNewLicense(false);
  }

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (errorTrial) return <DisplayError error={errorTrial} />;
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
      <LicenseNew open={newLicense} onClose={handleCloseNewLicense} />
      <EntetePage>
        <h3>{t('licenses')}</h3>
        <HelpButton showHelp={toggleHelpVisibility} />
        <ButtonNew
          label={t('new-license')}
          onClick={() => {
            setNewLicense(true);
          }}
        />
        {!state.trialLicense?.id && (
          <>
            <ButtonStyled onClick={activateTrial}>
              <Gift />
              <span>{t('activate-trial')}</span>
            </ButtonStyled>
            {loadingTrial && <Spinner size={24} />}
          </>
        )}
      </EntetePage>
      <Form>
        <FormHeader>
          <FormTitle>
            {t('available-licenses')}
            <span>
              {t('license-info', {
                free: state.freeLicense,
                total: state.totalLicenses,
                valid: state.validLicense,
              })}
            </span>
          </FormTitle>
        </FormHeader>
        {state.unusedLicenses.length && (
          <FormBodyFull>
            <Table columns={columnsUnused} data={state.unusedLicenses} />
          </FormBodyFull>
        )}
      </Form>
      {state.usedLicenses.count && (
        <Form>
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
            data={state.usedLicenses}
            error={error}
            loading={loading}
            actionButtons={[{ type: 'view', action: viewLicense }]}
          />
        </Form>
      )}
    </>
  );
}
