import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import SignOut from './User/SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User/Queries';
import Footer from './Footer';

export default function Nav() {
  const user = useUser();
  const { t } = useTranslation('navigation');

  if (user?.id)
    return (
      <NavStyles>
        <li>
          <Link href="/sdk">{t('sdk')}</Link>
        </li>
        <li>
          <Link href="/applications">{t('applications')}</Link>
        </li>
        <li>
          <Link href="/licenses">{t('licenses')}</Link>
        </li>
        <li>
          <Link href="/signals">{t('signals')}</Link>
        </li>
        {user.role?.canManagePrice && (
          <li>
            <Link href="/prices">{t('prices')}</Link>
          </li>
        )}
        <li>
          <Link href="/orders">{t('orders')}</Link>
        </li>
        {(user.role?.canSeeOtherUsers || user.role?.canManageUsers) && (
          <li>
            <Link href="/users">{t('users')}</Link>
          </li>
        )}
        <li>
          <Link href="/notifications">{t('notifications')}</Link>
        </li>
        <li>
          <div>
            <SignOut />
            <Footer />
          </div>
        </li>
      </NavStyles>
    );
  return null;
}
