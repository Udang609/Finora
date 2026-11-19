import React, { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-btn focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-finora-primary hover:bg-finora-primaryDark text-white shadow-sm focus:ring-finora-primary',
    secondary: 'bg-finora-lightBlue text-finora-primary hover:bg-blue-100 focus:ring-finora-primary',
    danger: 'bg-finora-red hover:bg-red-700 text-white shadow-sm focus:ring-finora-red',
    ghost: 'text-finora-textSecondary hover:bg-slate-100 hover:text-finora-textPrimary focus:ring-slate-300',
    outline: 'border border-finora-border text-finora-textPrimary hover:bg-slate-50 focus:ring-finora-primary',
    success: 'bg-finora-green hover:bg-green-700 text-white shadow-sm focus:ring-finora-green',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="flex items-center">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex items-center">{rightIcon}</span>}
    </button>
  );
};
