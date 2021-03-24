import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import SignOut from './SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();
  const { t } = useTranslation('navigation');

  // const { openCart } = useCart();
  return (
    <NavStyles>
      {user ? (
        <>
          <Link href="/applications">{t('applications')}</Link>
          <Link href="/licenses">{t('licenses')}</Link>
          <Link href="/signals">{t('signals')}</Link>
          <SignOut />
        </>
      ) : (
        <>
          <Link href="/signin">{t('signin')}</Link>
          <Link href="/signup">{t('signup')}</Link>
        </>
      )}
    </NavStyles>
  );
}
