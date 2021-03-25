import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/dist/client/router';

import { CURRENT_USER_QUERY } from '../User';

const SIGN_OUT_MUTATION = gql`
  mutation {
    endSession
  }
`;

export default function SignOut() {
  const [signout] = useMutation(SIGN_OUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  const router = useRouter();
  const { t } = useTranslation('navigation');

  function handleClick() {
    signout().then(() => router.push('/'));
  }

  return (
    <button type="button" onClick={handleClick}>
      {t('signout')}
    </button>
  );
}
