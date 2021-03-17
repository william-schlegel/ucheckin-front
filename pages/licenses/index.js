import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery, useLazyQuery } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { Gift } from 'react-feather';

import Pagination from '../../components/Pagination';
import Table, { useColumns } from '../../components/Tables/Table';
import { perPage } from '../../config';
import Loading from '../../components/Loading';
import DisplayError from '../../components/ErrorMessage';
import EntetePage from '../../components/styles/EntetePage';
import ButtonNew from '../../components/Buttons/ButtonNew';
import LicenseDetails from '../../components/License/LicenseDetails';
import LicenseNew from '../../components/License/LicenseNew';
import Switch from '../../components/Tables/Switch';
import SearchField, { useSearch } from '../../components/SearchField';
import {
  PAGINATION_QUERY,
  ALL_LICENSES_QUERY,
} from '../../components/License/Queries';
import { useHelp, Help, HelpButton } from '../../components/Help';
import ValidityDate from '../../components/Tables/ValidityDate';
import { ButtonStyled } from '../../components/styles/Button';

export default function Licenses() {
  const router = useRouter();
  const { error: errorPage, loading: loadingPage, data: dataPage } = useQuery(
    PAGINATION_QUERY
  );
  const page = parseInt(router.query.page) || 1;
  const { count } = dataPage?.count || 1;
  const { t } = useTranslation('license');
  const [findLicenses, { error, loading, data }] = useLazyQuery(
    ALL_LICENSES_QUERY
  );
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

  // calculate number of free & number of valid licenses, find the trial license
  const [freeLicense, validLicense, trialLicense] = useMemo(() => {
    if (!data?.allLicenses) return [0, 0, null];
    const nbFree = data.allLicenses.reduce((cnt, item) => {
      if (!item.signal || !item.application) return cnt + 1;
      return cnt;
    }, 0);
    const nbValid = data.allLicenses.reduce((cnt, item) => {
      if (item.valid) return cnt + 1;
      return cnt;
    }, 0);
    const trial = data.allLicenses.find((l) => l.trialLicense);
    return [nbFree, nbValid, trial];
  }, [data]);

  // aggregate licenses in 2 groups
  const [usedLicenses, unusedLicenses] = useMemo(() => {
    if (!data?.allLicenses) return [[], []];
    const used = new Map();
    const unused = new Map();

    function compare(map, key, item) {
      if (map.has(key)) {
        const lic = map.get(key);
        if (lic.validity === item.validity && lic.owner.id === item.owner.id) {
          lic.count += 1;
          map.set(key, lic);
          return;
        }
      }
      map.set(key, { item, count: 1 });
    }

    data.allLicenses.forEach((l) => {
      const key = l?.signal || '-';
      if (l?.signal) {
        compare(used, key, l);
      } else {
        compare(unused, key, l);
      }
    });
    return [Array.from(used), Array.from(unused)];
  }, [data]);

  console.log(`used`, { usedLicenses, unusedLicenses });
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
    console.log('activate trial');
  }

  const columns = useColumns([
    ['id', 'id', 'hidden'],
    [t('associated-signal'), 'signal.signal'],
    [t('associated-application'), 'application.name'],
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
    [t('common:owner'), 'owner.name'],
  ]);

  function handleCloseShowLicense() {
    setShowLicense('');
  }
  function handleCloseNewLicense() {
    setNewLicense(false);
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
        {count === 0 && (
          <ButtonStyled onClick={activateTrial}>
            <Gift />
            <span>{t('activate-trial')}</span>
          </ButtonStyled>
        )}
      </EntetePage>
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
      <p>non utilisé : {freeLicense}</p>
      <p>valides : {validLicense}</p>
      <p>trial : {trialLicense?.id}</p>
      <Table
        columns={columns}
        data={data?.allLicenses.filter((lic) => lic.signal && lic.application)}
        error={error}
        loading={loading}
        actionButtons={[{ type: 'view', action: viewLicense }]}
      />
    </>
  );
}
