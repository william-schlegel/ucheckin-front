import { useUser } from '../components/User';
import MyCompte from '../components/Profile/Compte';
import Loading from '../components/Loading';

export default function Compte() {
  const user = useUser();
  if (!user) return <Loading />;
  return <MyCompte id={user.id} />;
}
