import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

import DashboardApplication from './Applications';
import DashboardSignal from './Signals';
import { useHelp, Help, HelpButton } from '../Help';
import { FormHeader, FormTitle, Block, H2 } from '../styles/Card';
import DashboardUser from './Users';
import { useUser } from '../User/Queries';
import DashboardLicense from './Licenses';
import DashboardOrder from './Orders';

const DashboardStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex: 1 0 400px;
  gap: 1rem;
  & > * {
    min-width: 30%;
  }
  h2 {
    margin: 0;
    margin-bottom: 1rem;
    color: var(--secondary);
  }
`;

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
      <DashboardStyled>
        {user.role?.canManageUsers && <DashboardUser />}
        <DashboardApplication />
        <DashboardSignal />
        <DashboardLicense />
        <DashboardOrder />
      </DashboardStyled>
    </>
  );
}
