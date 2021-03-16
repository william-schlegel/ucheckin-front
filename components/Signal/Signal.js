import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import DisplayError from '../ErrorMessage';
import LicenseTable from '../License/LicenseTable';
import Loading from '../Loading';
import { useHelp, Help, HelpButton } from '../Help';
import {
  Form,
  FormBodyFull,
  FormHeader,
  FormTitle,
  Label,
  RowFull,
  RowReadOnly,
} from '../styles/Card';
import { SIGNAL_QUERY } from './Queries';
import SignalFiles from './SignalFiles';

export default function Signal({ id }) {
  const { loading, error, data } = useQuery(SIGNAL_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('signal');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('signal');

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;

  return (
    <>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      <Form>
        <FormHeader>
          <FormTitle>
            {t('signal')} <span>{data.Signal.signal}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.Signal.owner.name}</span>
          </RowReadOnly>
          <RowFull>
            <Label>{t('license:licenses')}</Label>
            <LicenseTable licenses={data.Signal.licenses} />
          </RowFull>
        </FormBodyFull>
      </Form>
      <p>&nbsp;</p>
      <SignalFiles signalId={id} files={data.Signal.files} />
    </>
  );
}

Signal.propTypes = {
  id: PropTypes.string,
};
