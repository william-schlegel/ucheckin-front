import { useMutation } from '@apollo/client';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';

import { CURRENT_USER_QUERY, SIGN_OUT_MUTATION } from './Queries';

export default function SignOut() {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const router = useRouter();
  const { t } = useTranslation('navigation');

  function handleClick() {
    signout().then(() => {
      router.push('/');
      router.reload();
    });
  }

  return (
    <button type="button" onClick={handleClick}>
      {t('signout')}
    </button>
  );
}
