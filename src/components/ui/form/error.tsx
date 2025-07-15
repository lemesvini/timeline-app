export type ErrorProps = {
  errorMessage?: string | null;
};

export const Error = ({ errorMessage }: ErrorProps) => {
  if (!errorMessage) return null;

  return (
    <div
      role='alert'
      aria-label={errorMessage}
      className='text-sm font-semibold text-red-500'
    >
      {errorMessage}
    </div>
  );
};

export interface FieldErrorProps {
  message?: string;
}

export const FieldError = ({ message }: FieldErrorProps) => {
  if (!message) return null;

  return <div className='text-sm text-destructive'>{message}</div>;
};
