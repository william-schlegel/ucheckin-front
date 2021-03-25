import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Select from 'react-select';
import Loading from './Loading';

const ALL_USER_QUERY = gql`
  query ALL_USER_QUERY {
    allUsers {
      id
      name
      email
    }
  }
`;

export default function SearchUser({
  name,
  value,
  onChange,
  multiple,
  required,
}) {
  const { loading, data } = useQuery(ALL_USER_QUERY);
  const users = data?.allUsers || [];

  if (loading) return <Loading />;
  return (
    <div style={{ width: '100%' }}>
      <Select
        required={required}
        defaultValue={value}
        isMulti={multiple}
        name={name}
        options={users.map((u) => ({ value: u.id, label: u.name }))}
        onChange={(us) => onChange({ type: 'search-users', name, value: us })}
        className="basic-multi-select"
        classNamePrefix="select"
      />
    </div>
  );
}

SearchUser.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.shape({ key: PropTypes.string, value: PropTypes.string }),
  onChange: PropTypes.func.isRequired,
  multiple: PropTypes.bool,
  required: PropTypes.bool,
};
