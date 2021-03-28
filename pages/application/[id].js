import PropTypes from 'prop-types';
import ViewApplication from '../../components/Application/Application';
import { QUERY_APPLICATION } from '../../components/Application/Queries';

export default function Application({ id, initialData }) {
  return <ViewApplication id={id} initialData={initialData} />;
}

Application.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Application.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  console.log(`id`, id);
  const initialData = await apolloClient.query({
    query: QUERY_APPLICATION,
    variables: { id },
  });
  return {
    id,
    initialData: { ...initialData, licenseType: initialData.licenseType?.id },
  };
};
