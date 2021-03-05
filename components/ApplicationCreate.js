import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import useForm from '../../lib/useForm';
import DisplayError from '../../components/ErrorMessage';
import { ALL_APPLICATIONS_QUERY } from '../applications/index';
import Form from '../../components/styles/Form';
import { useUser } from '../../components/User';

const CREATE_APPLICATION_MUTATION = gql`
  mutation CREATE_APPLICATION_MUTATION(
    $name: String!
    $owner: ID!
    $users: [ID!]
    $license: String
    $validity: String
  ) {
    createApplication(
      data: {
        name: $name
        apiKey: $apiKey
        owner: $owner
        users: $users
        license: $license
        validity: $validity
      }
    ) {
      id
    }
  }
`;

const UPDATE_APPLICATION_MUTATION = gql`
  mutation UPDATE_APPLICATION_MUTATION(
    $id: ID!
    $name: String!
    $apiKey: String!
    $owner: ID!
    $users: [ID!]
    $license: String
    $validity: String
  ) {
    updateApplication(
      id: $id
      data: {
        name: $name
        apiKey: $apiKey
        owner: $owner
        users: $users
        license: $license
        validity: $validity
      }
    ) {
      id
    }
  }
`;

const QUERY_APPLICATION = gql`
  query QUERY_APPLICATION($id: ID!) {
    Application(where: { id: $id }) {
      name
      apiKey
      owner {
        id
        name
      }
      users {
        id
        name
      }
      license
      validity
    }
  }
`;
export default function Application({ query }) {
  const { loading, error, data } = useQuery(QUERY_APPLICATION, {
    variables: { id: query.id },
  });
  const dataValues = Object.values(data).join('');

  const user = useUser();
  const { inputs, handleChange, clearForm, resetForm, setInputs } = useForm({
    name: '',
    apiKey: '',
    owner: '',
    users: [],
    license: '',
    validity: new Date(),
  });
  const { t } = useTranslation('application');

  useEffect(() => {
    const { Application: AppData } = data;
    setInputs({
      name: AppData.name,
      apiKey: AppData.apiKey,
      owner: AppData.owner.name,
      users: AppData.users.map((u) => u.name),
      license: AppData.license,
      validity: new Date(AppData.validity),
    });
  }, [setInputs, dataValues]);
  // const [createProduct, { loading, error, data }] = useMutation(
  //   CREATE_PRODUCT_MUTATION,
  //   {
  //     variables: inputs,
  //     refetchQueries: [{ query: ALL_PRODUCTS_QUERY }],
  //   }
  // );
  return (
    <Form
    // onSubmit={async (e) => {
    //   e.preventDefault();
    //   // Submit the inputfields to the backend:
    //   const res = await createProduct();
    //   clearForm();
    //   // Go to that product's page!
    //   Router.push({
    //     pathname: `/product/${res.data.createProduct.id}`,
    //   });
    // }}
    >
      <DisplayError error={error} />
      {!loading && (
        <fieldset disabled={loading} aria-busy={loading}>
          <label htmlFor="name">
            {t('common:name')}
            <input
              required
              type="text"
              id="name"
              name="name"
              value={inputs.name}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="api-key">
            {t('api-key')}
            <input
              type="text"
              id="api-key"
              name="api-key"
              defaultValue={inputs.apiKey}
              disabled
            />
          </label>
          <label htmlFor="owner">
            {t('common:owner')}
            <input
              required
              type="text"
              id="owner"
              name="owner"
              defaultValue={inputs.owner}
              disabled
            />
          </label>
          <label htmlFor="users">
            {t('common:users')}
            <input
              required
              type="text"
              id="users"
              name="users"
              defaultValue={inputs.users.join(', ')}
              disabled
            />
          </label>

          <button type="submit">+ Add Product</button>
        </fieldset>
      )}
    </Form>
  );
}

Application.propTypes = {
  query: PropTypes.object,
};
