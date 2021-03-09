import { useUser } from '../components/User';
import MyProfile from '../components/Profile/Profile';

export default function Profile() {
  const user = useUser();
  return <MyProfile id={user?.id} />;
}
