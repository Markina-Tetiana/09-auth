'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { login } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignInPage.module.css';

interface ApiErrorResponse {
  error?: string;
  response?: {
    message?: string;
  };
}

export default function SignInPage() {
  const router = useRouter();
  const setUser = useAuthStore(state => state.setUser);
  const [error, setError] = useState('');

  const handleSubmit = async (formData: FormData) => {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      setError('');

      const user = await login({
        email,
        password,
      });

      setUser(user);

      router.push('/profile');
    } catch (error) {
      if (isAxiosError<ApiErrorResponse>(error)) {
        const message =
          error.response?.data?.response?.message ??
          error.response?.data?.error ??
          'Login failed';

        setError(message);
      } else {
        setError('Login failed');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            className={css.input}
            required
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
