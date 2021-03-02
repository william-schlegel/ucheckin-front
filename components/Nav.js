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
      {user && (
        <>
          <Link href="/applications">{t('application')}</Link>
          {/* <Link href="/sell">Sell</Link>
          <Link href="/orders">Orders</Link>
          <Link href="/account">Account</Link> */}
          <SignOut />
          {/* <button type="button" onClick={openCart}>
            My Cart
            <CartCount
              count={user.cart.reduce(
                (tally, cartItem) =>
                  tally + (cartItem.product ? cartItem.quantity : 0),
                0
              )}
            />
          </button> */}
        </>
      )}
      {!user && (
        <>
          <Link href="/signin">{t('signin')}</Link>
          <Link href="/signup">{t('signup')}</Link>
        </>
      )}
    </NavStyles>
  );
}
