import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import PropTypes from 'prop-types';

import Footer from './Footer';
import NavStyles from './styles/NavStyles';
import { useUser } from './User/Queries';
import SignOut from './User/SignOut';

export default function Nav({ toggled }) {
  const { user } = useUser();
  const { t } = useTranslation('navigation');
  if (user?.id)
    return (
      <NavStyles className="menu" toggled={toggled}>
        <ul>
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
            <Link href="/events">{t('events')}</Link>
          </li>
          <li>
            <Link href="/umit">{t('umit')}</Link>
          </li>
          <li>
            <div>
              <SignOut />
              <Footer />
            </div>
          </li>
        </ul>
      </NavStyles>
    );
  return null;
}

Nav.propTypes = {
  toggled: PropTypes.bool,
};
