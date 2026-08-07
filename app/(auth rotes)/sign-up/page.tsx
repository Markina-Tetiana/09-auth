'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { register } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './SignUpPage.module.css';

interface ApiErrorResponse {
  error?: string;
  response?: {
    message?: string;
  };
}

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const setUser = useAuthStore(state => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    const email = String(formData.get('email') ?? '');
    const password = String(formData.get('password') ?? '');

    try {
      setError('');

      const user = await register({
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
          'Registration failed';

        setError(message);
      } else {
        setError('Registration failed');
      }
    }
  };

  return (
    <main className={css.mainContent}>
      <h1 className={css.formTitle}>Sign up</h1>

      <form className={css.form} action={handleSubmit}>
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
            Register
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
