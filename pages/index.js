import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Dashboard from '../components/Dashboard/Dashboard';
import { useUser } from '../components/User/Queries';
import Loading from '../components/Loading';
import DisplayError from '../components/ErrorMessage';

export default function Index() {
  const { loading, error, authenticated } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) router.push('/login');
  }, [authenticated, loading, router]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (!authenticated) return null;
  return <Dashboard />;
}
