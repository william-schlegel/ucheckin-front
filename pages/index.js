import useTranslation from 'next-translate/useTranslation';
import DashboardApplication from '../components/Dashboard/Applications';
import DashboardSignal from '../components/Dashboard/Signals';
import { useHelp, Help, HelpButton } from '../components/Help';
import {
  FormHeader,
  FormTitle,
  FormBody,
  Block,
} from '../components/styles/Card';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('main');

  return (
    <>
      <Help
        contents={helpContent}
        visible={helpVisible}
        handleClose={toggleHelpVisibility}
      />
      <FormHeader>
        <FormTitle>
          <Block>
            <span>{t('dashboard')}</span>
            <HelpButton showHelp={toggleHelpVisibility} />
          </Block>
        </FormTitle>
      </FormHeader>
      <FormBody>
        <DashboardApplication />
        <DashboardSignal />
      </FormBody>
    </>
  );
}
