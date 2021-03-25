import Dashboard from '../components/Dashboard/Dashboard';
import SignIn from '../components/Registration/SignIn';
import { useUser } from '../components/User';

export default function Index() {
  const user = useUser();

  if (!user?.id) return <SignIn />;
  return <Dashboard />;
}
