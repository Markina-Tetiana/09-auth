'use client';

import Link from 'next/link';
import css from './AuthNavigation.module.css';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';

export default function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  const user = useAuthStore(state => state.user);

  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated,
  );

  const handleLogout = async () => {
    try {
      await logout();

      clearIsAuthenticated();

      router.push('/sign-in');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <li className={css.navigationItem}>
          <Link href="/profile" prefetch={false} className={css.navigationLink}>
            Profile
          </Link>
        </li>

        <li className={css.navigationItem}>
          <p className={css.userEmail}>{user?.email}</p>

          <button
            type="button"
            className={css.logoutButton}
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li className={css.navigationItem}>
        <Link href="/sign-in" prefetch={false} className={css.navigationLink}>
          Login
        </Link>
      </li>

      <li className={css.navigationItem}>
        <Link href="/sign-up" prefetch={false} className={css.navigationLink}>
          Register
        </Link>
      </li>
    </>
  );
}
