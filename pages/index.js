import useTranslation from 'next-translate/useTranslation';

export default function Dashboard() {
  const { t } = useTranslation('dashboard');
  return <div>{t('dashboard')}</div>;
}
