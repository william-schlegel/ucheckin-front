import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';
import Switch from 'react-switch';
import debounce from 'lodash.debounce';

import { SearchFilterStyles } from './styles/PaginationStyles';
import ActionButton from './Buttons/ActionButton';
import { BlockShort, Input, LabelShort } from './styles/Card';
import Spinner from './Spinner';

export default function SearchField({
  fields,
  showFilter,
  setShowFilter,
  filters,
  handleChange,
  setFilters,
  loading,
  resetFilters,
}) {
  const { t } = useTranslation('common');

  useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);

  if (!showFilter) return null;

  function closeSearch() {
    setShowFilter(false);
    resetFilters();
  }

  return (
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
              value={filters[field.field]}
              onChange={handleChange}
            />
          )}
          {field.type === 'switch' && (
            <Switch
              id={field.field}
              onChange={() =>
                handleChange({
                  value: !filters[field.field],
                  name: field.field,
                  type: field.type,
                })
              }
              checked={filters[field.field]}
            />
          )}
        </BlockShort>
      ))}
      <BlockShort>
        {loading && <Spinner />}
        {!loading && <ActionButton type="close" cb={closeSearch} />}
      </BlockShort>
    </SearchFilterStyles>
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
  showFilter: PropTypes.bool.isRequired,
  setShowFilter: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFilters: PropTypes.func.isRequired,
  resetFilters: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

function getDefaultValues(type) {
  if (type === 'text') return '';
  if (type === 'number') return 0;
  if (type === 'date') return new Date();
  if (type === 'switch') return false;
}

export function useSearch(fields = []) {
  // create a state object for our filters
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);
  const setFiltersButChill = useCallback(() => debounce(setFilters, 350), []);
  const resetFilters = useCallback(() => {
    const filter = fields.reduce(
      (o, f) => Object.assign(o, { [f.field]: getDefaultValues(f.type) }),
      {}
    );
    setFilters(filter);
  }, [fields, setFilters]);

  useEffect(() => {
    resetFilters();
  }, [fields, resetFilters]);

  function handleChange(e) {
    let { value, name, type } = e.target ? e.target : e;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'date') {
      value = new Date(value);
    }
    if (type === 'switch') {
      value = !!value;
    }
    const updatedFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(updatedFilters);
  }

  // return the things we want to surface from this custom hook
  return {
    filters,
    setFilters: setFiltersButChill,
    handleChange,
    showFilter,
    setShowFilter,
    resetFilters,
  };
}
