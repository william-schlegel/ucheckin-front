import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  return <div>{t('dashboard')}</div>;
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'dashboard'])),
  },
});
