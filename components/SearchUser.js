import PropTypes from 'prop-types';
import { useLazyQuery } from '@apollo/client';
import { resetIdCounter, useCombobox } from 'downshift';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import useTranslation from 'next-translate/useTranslation';

import { DropDown, DropDownItem, SearchStyles } from './styles/DropDown';

const SEARCH_USER_QUERY = gql`
  query SEARCH_USER_QUERY($searchTerm: String!) {
    searchTerms: allUsers(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { email_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      email
    }
  }
`;

export default function SearchUser({
  required,
  name,
  value,
  onChange,
  multiple,
}) {
  const [findItems, { loading, data }] = useLazyQuery(SEARCH_USER_QUERY, {
    fetchPolicy: 'no-cache',
  });
  const { t } = useTranslation('common');
  const items = data?.searchTerms || [];
  const findItemsButChill = debounce(findItems, 350);
  resetIdCounter();
  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    getItemProps,
    highlightedIndex,
  } = useCombobox({
    items,
    selectedItem: value,
    onInputValueChange({ inputValue }) {
      findItemsButChill({
        variables: {
          searchTerm: inputValue,
        },
      });
    },
    onSelectedItemChange({ selectedItem }) {
      if (!required || selectedItem)
        onChange({
          target: {
            value: JSON.stringify(selectedItem),
            name,
            type: multiple ? 'search-users' : 'search-user',
          },
        });
    },
    itemToString: (item) => item?.name || '',
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            type: 'select',
            placeholder: multiple ? t('search-users') : t('search-user'),
            id: 'search',
            className: loading ? t('loading') : '',
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({ item })}
              key={item.id}
              highlighted={index === highlightedIndex}
            >
              {item.name} ({item.email})
            </DropDownItem>
          ))}
        {isOpen && !items.length && !loading && (
          <DropDownItem>{t('user-not-found')}</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}

SearchUser.propTypes = {
  required: PropTypes.bool,
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({ key: PropTypes.string, value: PropTypes.string }),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
};
