import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { Search } from 'react-feather';
import Switch from 'react-switch';
import styled from 'styled-components';

import transformField from '../lib/transformField';
import ActionButton from './Buttons/ActionButton';
import { SecondaryButtonStyled } from './styles/Button';
import { BlockShort, Input, LabelShort } from './styles/Card';
import { SearchFilterStyles } from './styles/PaginationStyles';
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
    if (type === 'number') {
      value = parseInt(value);
      raz = value === 0;
    }
    if (type === 'switch') {
      value = !!value;
      raz = !value;
    }
    if (type === 'text') {
      raz = value === '';
    }

    const idFilter = filters.findIndex((f) => f.field === name);
    if (raz) {
      const newFilter = filters.find((f) => f.field !== name);
      if (newFilter) setFilters(newFilter);
      else setFilters([]);
      return;
    }
    const nFilter = [...filters];
    if (idFilter < 0) {
      nFilter.push({ field: name, value });
    } else {
      nFilter[idFilter].value = value;
    }
    setFilters(nFilter);
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
                  <Switch
                    id={field.field}
                    onChange={(value) =>
                      handleChange({
                        value,
                        name: field.field,
                        type: field.type,
                      })
                    }
                    checked={!!filters.find((f) => f.field === field.field)?.value}
                  />
                )}
              </BlockShort>
            ))}
            <BlockShort>
              <SecondaryButtonStyled onClick={() => onFilterChange(filters)}>
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

export function ActualFilter({ fields, actualFilter = {} }) {
  function getFilter(af) {
    let v = Object.values(af[1]);
    let op = Object.keys(af[1]);
    while (typeof v[0] !== 'string') {
      op = Object.keys(v[0]);
      v = Object.values(v[0]);
    }
    console.log(`op`, op);
    const fld = fields.find((f) => f.field.split('.')[0] === af[0]);
    let disp = v[0];
    if (op[0] === 'contains') disp = `* ${disp} *`;
    if (op[0] === 'lt' || op[0] === 'lte') disp = `< ${disp}`;
    if (op[0] === 'gt' || op[0] === 'gte') disp = `> ${disp}`;
    return (
      <Badge key={af[0]}>
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

  return { showFilter, setShowFilter, filters, handleNewFilter };
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
