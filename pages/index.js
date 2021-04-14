import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Dashboard from '../components/Dashboard/Dashboard';
import { useUser } from '../components/User/Queries';
import Loading from '../components/Loading';
import DisplayError from '../components/ErrorMessage';

export default function Index() {
  const { user, loading, error } = useUser();
  const router = useRouter();

  console.log({ user, loading, error });

  useEffect(() => {
    if (!loading && !user.id) router.push('/login');
  }, [user, loading, router]);

  if (loading) return <Loading />;
  if (error) return <DisplayError error={error} />;
  if (!user?.id) return null;
  return <Dashboard />;
}
