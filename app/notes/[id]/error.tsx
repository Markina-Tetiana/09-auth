'use client';

type Props = {
  error: Error;
  reset: () => void;
};

const ErrorPage = ({ error, reset }: Props) => {
  return (
    <div>
      <p>Could not fetch note details. {error.message}</p>
    </div>
  );
};

export default ErrorPage;
