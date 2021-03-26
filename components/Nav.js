import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';

import SignOut from './Registration/SignOut';
import NavStyles from './styles/NavStyles';
import { useUser } from './User';

export default function Nav() {
  const user = useUser();
  const { t } = useTranslation('navigation');

  if (user?.id)
    return (
      <NavStyles>
        <li>
          <Link href="/applications">{t('applications')}</Link>
        </li>
        <li>
          <Link href="/licenses">{t('licenses')}</Link>
        </li>
        <li>
          <Link href="/signals">{t('signals')}</Link>
        </li>
        {user.role.canManagePrice && (
          <li>
            <Link href="/prices">{t('prices')}</Link>
          </li>
        )}
        {user.role.canManageOrder && (
          <li>
            <Link href="/orders">{t('orders')}</Link>
          </li>
        )}
        <li>
          <SignOut />
        </li>
      </NavStyles>
    );
  return null;
}
