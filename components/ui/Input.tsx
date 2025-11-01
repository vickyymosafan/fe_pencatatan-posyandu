/**
 * Input Component
 * Reusable input field with label, error states, and validation
 * Follows design system specifications
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'textarea';

export interface InputProps {
  label: string;
  type?: InputType;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  rows?: number; // For textarea
}

/**
 * Input Component
 * 
 * @example
 * <Input
 *   label="Email"
 *   type="email"
 *   value={email}
 *   onChange={setEmail}
 *   error={emailError}
 *   required
 * />
 */
export function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  disabled = false,
  className,
  id,
  rows = 4,
}: InputProps) {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;

  const baseInputStyles = 'input w-full border rounded-lg py-2 px-3 transition-all';
  const normalStyles = 'border-neutral-300 focus:ring-2 focus:ring-neutral-400 focus:border-transparent';
  const errorStyles = 'border-red-500 focus:ring-2 focus:ring-red-400';
  const disabledStyles = 'bg-neutral-100 cursor-not-allowed';

  const inputStyles = cn(
    baseInputStyles,
    error ? errorStyles : normalStyles,
    disabled && disabledStyles,
    className
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={inputStyles}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      ) : (
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputStyles}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
        />
      )}
      
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1 text-sm text-red-600 flex items-center gap-1"
        >
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
