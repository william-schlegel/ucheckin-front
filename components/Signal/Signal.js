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
import ButtonBack from '../Buttons/ButtonBack';

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
            {t('signal')} <span>{data.Signal.name}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
          </FormTitle>
          <ButtonBack route="/signals" label={t('navigation:signals')} />
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
      <SignalFiles
        signalId={id}
        signalCode={data.Signal.name}
        files={data.Signal.files}
      />
    </>
  );
}

Signal.propTypes = {
  id: PropTypes.string,
};
