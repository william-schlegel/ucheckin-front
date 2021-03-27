import { useUser } from './User/Queries';
import SignIn from './SignIn';

export default function ({ children }) {
  const me = useUser();
  if (!me) return <SignIn />;
  return children;
}
