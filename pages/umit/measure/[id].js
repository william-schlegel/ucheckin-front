import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ButtonBack from '../../../components/Buttons/ButtonBack';
import { Help, HelpButton, useHelp } from '../../../components/Help';
import { Form, FormHeader, FormTitle } from '../../../components/styles/Card';
import { MeasureContent } from '../../../components/Umit/MeasureDetail';
import { MEASURE_QUERY } from '../../../components/Umit/Queries';

export default function Measure({ id, initialData }) {
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('application');
  const { t } = useTranslation('umit');
  console.log(`id`, id);
  return (
    <Form>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <FormHeader>
        <FormTitle>
          {t('measure-name')} <span>{initialData?.sensor?.name}</span>
          <HelpButton showHelp={toggleHelpVisibility} />
        </FormTitle>
        <ButtonBack route="/umit/measures" label={t('navigation:measures')} />
      </FormHeader>
      <MeasureContent data={initialData} />
    </Form>
  );
}

Measure.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Measure.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  const initialData = await apolloClient.query({
    query: MEASURE_QUERY,
    variables: { id },
  });
  return {
    id,
    initialData: initialData.data.umitMeasure,
  };
};
