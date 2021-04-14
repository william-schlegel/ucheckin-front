import { useState } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Switch from 'react-switch';
import styled from 'styled-components';

import { Search } from 'react-feather';
import { SearchFilterStyles } from './styles/PaginationStyles';
import ActionButton from './Buttons/ActionButton';
import { BlockShort, Input, LabelShort } from './styles/Card';
import { useUser } from './User/Queries';
import { SecondaryButtonStyled } from './styles/Button';
import transformField from '../lib/transformField';

const SwitchContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 0.25rem 0 0.75rem 0;
`;
export default function SearchField({
  fields,
  onFilterChange,
  onClose,
  isAdmin,
  showFilter,
}) {
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
      if (!idField)
        actualFilters.push({ field: 'owner', value: { id: user.id } });
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
                  value={
                    filters.find((f) => f.field === field.field)?.value || ''
                  }
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
                  checked={
                    !!filters.find((f) => f.field === field.field)?.value
                  }
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
