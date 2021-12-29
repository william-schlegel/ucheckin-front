import { useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';
import useTranslation from 'next-translate/useTranslation';
import { LogOut } from 'react-feather';

import useAction from '../../lib/useAction';
import { CURRENT_USER_QUERY, SIGN_OUT_MUTATION } from './Queries';

export default function SignOut({ reduced }) {
  const { setAction } = useAction();
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const router = useRouter();
  const { t } = useTranslation('navigation');

  async function handleClick() {
    setAction('login', 'logout');
    await signout();
    router.push('/');
  }

  return (
    <button type="button" onClick={handleClick}>
      {reduced ? (
        <LogOut size={24} />
      ) : (
        <span style={{ width: '100%', textAlign: 'center' }}>{t('signout')}</span>
      )}
    </button>
  );
}
