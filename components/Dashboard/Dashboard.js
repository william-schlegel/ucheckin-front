import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import styled from 'styled-components';

import { Help, HelpButton, useHelp } from '../Help';
import { Block, FormHeader, FormTitle, H2 } from '../styles/Card';
import { useUser } from '../User/Queries';
import DashboardApplication from './Applications';
import DashboardEvent from './Events';
import DashboardInvoice from './Invoices';
import DashboardLicense from './Licenses';
import DashboardNotification from './Notifications';
import DashboardSignal from './Signals';
import DashboardStatistics from './Statistics';
import DashboardMeasure from './UmitMeasures';
import DashboardSensor from './UmitSensors';
import DashboardUmixes from './Umixes';
import DashboardUser from './Users';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  const { helpContent, toggleHelpVisibility, helpVisible } = useHelp('dashboard');
  const { user } = useUser();
  return (
    <>
      <Head>
        <title>UCheck In - {t('dashboard')}</title>
      </Head>
      <Help contents={helpContent} visible={helpVisible} handleClose={toggleHelpVisibility} />
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
        {user.canSeeAppMenu && (
          <>
            <DashboardApplication />
            <DashboardSignal />
            <DashboardLicense />
            <DashboardNotification />
          </>
        )}
        {user.role?.canSeeOrder && <DashboardInvoice />}
        {user.canSeeUcheckinMenu && <DashboardEvent />}
        {user.canSeeUmitMenu && (
          <>
            <DashboardSensor />
            <DashboardMeasure />
          </>
        )}
        {user.canSeeUmixMenu && <DashboardUmixes />}
      </DashboardStyled>
      {user.canSeeAppMenu && <DashboardStatistics />}
    </>
  );
}

const DashboardStyled = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  & > * {
    flex: 1 1 30em;
  }
  h2 {
    margin: 0 !important;
    margin-bottom: 1rem;
    color: var(--secondary);
  }
`;
