import Dashboard from '../components/Dashboard/Dashboard';
import SignIn from '../components/User/SignIn';
import { useUser } from '../components/User/Queries';

export default function Index() {
  const user = useUser();

  if (!user?.id) return <SignIn />;
  return <Dashboard />;
}
