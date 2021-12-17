import { isDate } from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Search, X } from 'react-feather';
import Switch from 'react-switch';
import styled from 'styled-components';

import transformField from '../lib/transformField';
import ActionButton from './Buttons/ActionButton';
import DatePicker, { dateNow, formatDate } from './DatePicker';
import { SecondaryButtonStyled } from './styles/Button';
import { BlockShort, FormBody, Input, LabelShort } from './styles/Card';
import { SearchFilterStyles } from './styles/PaginationStyles';
import { Switch3States } from './Tables/Switch';
import { useUser } from './User/Queries';

export default function SearchField({ fields, onFilterChange, onClose, isAdmin, showFilter }) {
  const { t } = useTranslation('common');
  const [admin, setAdmin] = useState(false);
  const { user } = useUser();
  const [filters, setFilters] = useState([]);

  function closeSearch() {
    setFilters([]);
    onClose();
  }

  function handleSwitchAccount(checked) {
    let actualFilters = [...filters];
    const idField = filters.find((f) => f.field === 'owner');
    if (checked) {
      if (!idField) actualFilters.push({ field: 'owner', value: { id: { equals: user.id } } });
    } else if (idField) {
      if (actualFilters.length === 1) actualFilters = [];
      else actualFilters = filters.find((f) => f.field !== 'owner');
    }
    setFilters(actualFilters);
    setAdmin(checked);
    onFilterChange(actualFilters);
  }

  function handleChange(e) {
    let { value, name, type } = e.target ? e.target : e;
    let raz = false;
    let vFilter;
    if (type === 'number') {
      vFilter = parseInt(value);
      raz = vFilter === 0;
    }
    if (type === 'switch') {
      vFilter = value === 'checked';
      raz = value === 'undefined';
    }
    if (type === 'text') {
      vFilter = value;
      raz = value === '';
    }
    if (type === 'date') {
      console.log(`search filter value`, value);
      if (isDate(value)) vFilter = value.toISOString();
      else vFilter = dateNow();
      console.log(`vFilter`, vFilter);
      raz = value === '';
    }

    const idFilter = filters.findIndex((f) => f.field === name);
    if (raz) {
      const newFilter = filters.filter((f) => f.field !== name);
      setFilters(newFilter);
      return;
    }
    const nFilter = [...filters];
    if (idFilter < 0) {
      nFilter.push({ field: name, value: vFilter });
    } else {
      nFilter[idFilter].value = vFilter;
    }
    setFilters(nFilter);
  }

  function handleSearch() {
    onFilterChange(filters);
    closeSearch();
  }

  function getSwitchFilterValue(field) {
    const flt = filters.find((f) => f.field === field.field);
    let ret = 'undefined';
    if (typeof flt?.value === 'boolean') ret = flt.value ? 'checked' : 'unchecked';
    return ret;
  }

  function getDateValue(field) {
    const flt = filters.find((f) => f.field === field.field);
    return flt?.value || dateNow();
  }

  return (
    <>
      {isAdmin && (
        <SwitchContainer>
          <span>{t('only-my-account')}</span>
          <Switch checked={admin} onChange={handleSwitchAccount} />
        </SwitchContainer>
      )}
      {showFilter && (
        <>
          <SearchFilterStyles>
            <BlockShort>
              <span>{t('filters')}</span>
            </BlockShort>
            <FormBody columns={Math.min(4, fields.length)}>
              {fields.map((field) => (
                <BlockShort key={field.field}>
                  <LabelShort htmlFor={field.field}>{field.label}</LabelShort>
                  {field.type === 'text' && (
                    <Input
                      type="text"
                      id={field.field}
                      name={field.field}
                      value={filters.find((f) => f.field === field.field)?.value || ''}
                      onChange={handleChange}
                    />
                  )}
                  {field.type === 'switch' && (
                    <Switch3States
                      id={field.field}
                      callBack={(value) =>
                        handleChange({
                          value,
                          name: field.field,
                          type: field.type,
                        })
                      }
                      value={getSwitchFilterValue(field)}
                    />
                  )}
                  {field.type === 'date' && (
                    <DatePicker
                      id={field.field}
                      ISOStringValue={getDateValue(field)}
                      onChange={(value) =>
                        handleChange({
                          name: field.field,
                          type: field.type,
                          value,
                        })
                      }
                      UTC
                    />
                  )}
                </BlockShort>
              ))}
            </FormBody>
            <BlockShort>
              <SecondaryButtonStyled onClick={handleSearch}>
                <Search />
                <span>{t('start-search')}</span>
              </SecondaryButtonStyled>
            </BlockShort>
            <BlockShort>
              <ActionButton type="close" cb={closeSearch} />
            </BlockShort>
          </SearchFilterStyles>
        </>
      )}
    </>
  );
}

SearchField.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.oneOf(['text', 'number', 'date', 'switch']),
    })
  ).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
  showFilter: PropTypes.bool,
};

export function ActualFilter({ fields, actualFilter = {}, removeFilters = () => {} }) {
  function getFilter(af) {
    console.log(`af`, af);
    let v = Object.values(af[1]);
    let op = Object.keys(af[1]);
    while (typeof v[0] !== 'string' && typeof v[0] !== 'boolean') {
      op = Object.keys(v[0]);
      v = Object.values(v[0]);
    }
    const fld = fields.find((f) => f.field.split('.')[0] === af[0]);
    let disp = v[0];
    if (af[0] === 'date') disp = formatDate(new Date(v[0]));
    if (op[0] === 'contains') disp = `* ${disp} *`;
    if (op[0] === 'lt') disp = `< ${disp}`;
    if (op[0] === 'gt') disp = `> ${disp}`;
    if (op[0] === 'lte') disp = `<= ${disp}`;
    if (op[0] === 'gte') disp = `>= ${disp}`;
    if (typeof v[0] === 'boolean') disp = v[0] ? 'true' : 'false';
    return (
      <Badge key={`${af[0]}-${v}`}>
        <span>{fld?.label || af[0]}:</span>
        <strong>{disp}</strong>
      </Badge>
    );
  }
  if (!actualFilter) return null;
  return (
    <BadgeList>
      {actualFilter.AND
        ? actualFilter.AND.map((af) => getFilter(Object.entries(af)[0]))
        : Object.entries(actualFilter).map((af) => getFilter(af))}
      {Object.entries(actualFilter).length > 0 ? (
        <Badge onClick={removeFilters}>
          <X size={24} />
        </Badge>
      ) : null}
    </BadgeList>
  );
}
ActualFilter.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      label: PropTypes.string,
      type: PropTypes.oneOf(['text', 'number', 'date', 'switch']),
    })
  ).isRequired,

  actualFilter: PropTypes.object,
};

export function useFilter() {
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState();

  function handleNewFilter(newFilters) {
    if (!newFilters.length) {
      setFilters(null);
      return;
    }
    if (newFilters.length === 1) {
      setFilters(transformField(newFilters[0]));
      return;
    }
    setFilters({
      AND: newFilters.map((nf) => transformField(nf)),
    });
  }

  function resetFilters() {
    setFilters(null);
  }

  return { showFilter, setShowFilter, filters, handleNewFilter, resetFilters };
}

const SwitchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 0.25rem 0 0.75rem 0;
`;

const BadgeList = styled.div`
  display: flex;
  gap: 1rem;
  padding: 3px;
  margin-bottom: 1rem;
`;

const Badge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--light-grey);
  padding: 0.1rem 2rem;
  border-radius: 3rem;
  color: var(--text-color);
`;
