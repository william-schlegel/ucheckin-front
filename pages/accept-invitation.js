import PropTypes from 'prop-types';

import AcceptInvitation from '../components/Application/AcceptInvitation';

export default function ResetPage({ query }) {
  if (!query?.token) {
    return (
      <div>
        <p>Sorry you must supply a token</p>
      </div>
    );
  }
  return <AcceptInvitation token={query.token} />;
}

ResetPage.propTypes = {
  query: PropTypes.object,
};
