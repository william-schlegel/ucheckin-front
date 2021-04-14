import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Select from 'react-select';
import Loading from './Loading';
import selectTheme from './styles/selectTheme';

const ALL_USER_QUERY = gql`
  query ALL_USER_QUERY {
    allUsers {
      id
      name
      email
    }
  }
`;

export function SearchUser({ name, value, onChange, required }) {
  const { loading, data } = useQuery(ALL_USER_QUERY);
  const users = data?.allUsers || [];
  const userList = users.map((u) => ({ value: u.id, label: u.name }));

  function handleChange(us) {
    onChange({ name, value: us.value });
  }

  if (loading) return <Loading />;
  return (
    <Select
      theme={selectTheme}
      className="select"
      required={required}
      value={userList.find((u) => u.value === value)}
      name={name}
      options={userList}
      onChange={handleChange}
      // className="basic-multi-select"
      // classNamePrefix="select"
    />
  );
}

SearchUser.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};

export function SearchUsers({ name, value, onChange, required }) {
  const { loading, data } = useQuery(ALL_USER_QUERY);
  const users = data?.allUsers || [];
  const userList = users.map((u) => ({ value: u.id, label: u.name }));

  if (loading) return <Loading />;
  return (
    <Select
      theme={selectTheme}
      className="select"
      required={required}
      value={value.map((v) => userList.find((u) => u.value === v))}
      name={name}
      isMulti
      options={userList}
      onChange={(us) =>
        onChange({ name, value: us.map((u) => ({ id: u.value })) })
      }
      // className="basic-multi-select"
      // classNamePrefix="select"
    />
  );
}

SearchUsers.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
};
