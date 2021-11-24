import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import ButtonBack from '../../../components/Buttons/ButtonBack';
import { Help, HelpButton, useHelp } from '../../../components/Help';
import { Form, FormHeader, FormTitle } from '../../../components/styles/Card';
import { SENSOR_QUERY } from '../../../components/Umit/Queries';
import { SensorContent } from '../../../components/Umit/SensorDetail';

export default function Sensor({ id, initialData }) {
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('application');
  const { t } = useTranslation('umit');
  console.log(`id`, id);
  return (
    <Form>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
      <FormHeader>
        <FormTitle>
          {t('sensor-name')} <span>{initialData?.name}</span>
          <HelpButton showHelp={toggleHelpVisibility} />
        </FormTitle>
        <ButtonBack route="/umit/sensors" label={t('navigation:sensors')} />
      </FormHeader>
      <SensorContent data={initialData} />
    </Form>
  );
}

Sensor.propTypes = {
  id: PropTypes.string,
  initialData: PropTypes.object,
};

Sensor.getInitialProps = async (ctx) => {
  const { apolloClient } = ctx;
  const { id } = ctx.query;
  const initialData = await apolloClient.query({
    query: SENSOR_QUERY,
    variables: { id },
  });
  return {
    id,
    initialData: initialData.data.umitSensor,
  };
};
