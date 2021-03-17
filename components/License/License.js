import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import DisplayError from '../ErrorMessage';
import LicenseTable from './LicenseTable';
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
import { LICENSE_QUERY } from './Queries';

export default function License({ id }) {
  const { loading, error, data } = useQuery(LICENSE_QUERY, {
    variables: { id },
  });
  const { t } = useTranslation('license');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('license');

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
            {t('license')} <span>{data.License.license}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
          </FormTitle>
        </FormHeader>
        <FormBodyFull>
          <RowReadOnly>
            <Label>{t('common:owner')}</Label>
            <span>{data.License.owner.name}</span>
          </RowReadOnly>
          <RowFull>
            <Label>{t('license:licenses')}</Label>
            <LicenseTable licenses={data.License.licenses} />
          </RowFull>
        </FormBodyFull>
      </Form>
    </>
  );
}

License.propTypes = {
  id: PropTypes.string,
};
