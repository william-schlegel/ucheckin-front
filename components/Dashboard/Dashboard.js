import useTranslation from 'next-translate/useTranslation';
import DashboardApplication from './Applications';
import DashboardSignal from './Signals';
import { useHelp, Help, HelpButton } from '../Help';
import { FormHeader, FormTitle, FormBody, Block, H2 } from '../styles/Card';
import DashboardUser from './Users';
import { useUser } from '../User';
import DashboardLicense from './Licenses';
import DashboardOrder from './Orders';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('main');
  const user = useUser();
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
            <H2>{t('dashboard')}</H2>
            <HelpButton showHelp={toggleHelpVisibility} />
          </Block>
        </FormTitle>
      </FormHeader>
      <FormBody>
        {user?.role.canManageUsers && <DashboardUser />}
        <DashboardApplication />
        <DashboardSignal />
        <DashboardLicense />
        {user?.role.canManageOrder && <DashboardOrder />}
      </FormBody>
    </>
  );
}
