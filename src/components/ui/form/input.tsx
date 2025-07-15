import * as React from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';

import { cn } from '@/lib/utils';

import {
  FieldWrapper,
  type FieldWrapperPassThroughProps,
} from './field-wrapper';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  FieldWrapperPassThroughProps & {
    className?: string;
    registration: Partial<UseFormRegisterReturn>;
  };

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, registration, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    const togglePasswordVisibility = (
      e: React.MouseEvent<HTMLButtonElement>,
    ) => {
      e.stopPropagation();
      setShowPassword(!showPassword);
    };

    return (
      <FieldWrapper label={label} error={error}>
        <div className='relative'>
          <input
            type={inputType}
            className={cn(
              'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              isPassword && 'pr-10',
              className,
            )}
            ref={ref}
            {...registration}
            {...props}
          />
          {isPassword && (
            <button
              type='button'
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground transition-colors'
              onClick={togglePasswordVisibility}
              onMouseDown={(e) => e.preventDefault()}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          )}
        </div>
      </FieldWrapper>
    );
  },
);
Input.displayName = 'Input';

export { Input };
