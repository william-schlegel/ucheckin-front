import { useUser } from '../components/User';
import MyProfile from '../components/Profile/Profile';

export default function Profile() {
  const user = useUser();
  console.log('user', user);
  return <MyProfile id={user?.id} />;
}
