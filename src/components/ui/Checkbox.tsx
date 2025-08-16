import React, { InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              className={cn(
                'h-4 w-4 rounded border-gray-300 dark:border-gray-600',
                'text-blue-600 focus:ring-blue-500 focus:ring-2',
                'bg-white dark:bg-gray-800',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && 'border-red-500',
                className
              )}
              {...props}
            />
          </div>
          {label && (
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {label}
            </label>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';