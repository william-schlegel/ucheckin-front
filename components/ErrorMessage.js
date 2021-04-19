import styled from 'styled-components';
import React from 'react';

import PropTypes from 'prop-types';
import useTranslation from 'next-translate/useTranslation';

const ErrorStyles = styled.div`
  padding: 2rem;
  background: var(--background-light);
  color: var(--text-color);
  margin: 2rem 0;
  box-shadow: var(--bs-card);
  border-left: 5px solid red;
  p {
    margin: 0;
    font-weight: 100;
  }
  strong {
    margin-right: 1rem;
  }
`;

const DisplayError = ({ error }) => {
  const { t } = useTranslation('common');
  if (!error) return null;
  if (typeof error === 'string') {
    return (
      <ErrorStyles>
        <p data-test="graphql-error">
          <strong>{t('error')}</strong>
          {error}
        </p>
      </ErrorStyles>
    );
  }

  if (!error.message) return null;
  if (
    error.networkError &&
    error.networkError.result &&
    error.networkError.result.errors.length
  ) {
    return error.networkError.result.errors.map((error, i) => (
      <ErrorStyles key={i}>
        <p data-test="graphql-error">
          <strong>{t('error')}</strong>
          {error.message.replace('GraphQL error: ', '')}
        </p>
      </ErrorStyles>
    ));
  }
  return (
    <ErrorStyles>
      <p data-test="graphql-error">
        <strong>{t('error')}</strong>
        {error.message.replace('GraphQL error: ', '')}
      </p>
    </ErrorStyles>
  );
};

DisplayError.defaultProps = {
  error: {},
};

DisplayError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
};

export default DisplayError;
