/**
 * Select Component
 * Reusable select/dropdown field with label, error states, and search
 * Follows design system specifications
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
}

/**
 * Select Component
 * 
 * @example
 * <Select
 *   label="Pilih Lansia"
 *   value={selectedLansia}
 *   onChange={setSelectedLansia}
 *   options={lansiaOptions}
 *   searchable
 * />
 */
export function Select({
  label,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = 'Pilih...',
  disabled = false,
  className,
  searchable = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);
  const inputId = `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  const errorId = `${inputId}-error`;

  // Get selected option label
  const selectedOption = options.find((opt) => opt.value === value);
  const displayValue = selectedOption?.label || placeholder;

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  const baseStyles = 'w-full border rounded-lg py-2 px-3 transition-all cursor-pointer';
  const normalStyles = 'border-neutral-300 hover:border-neutral-400';
  const errorStyles = 'border-red-500';
  const disabledStyles = 'bg-neutral-100 cursor-not-allowed';
  const focusStyles = 'focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:border-transparent focus-visible:ring-offset-2';

  const selectStyles = cn(
    baseStyles,
    error ? errorStyles : normalStyles,
    disabled && disabledStyles,
    !disabled && focusStyles,
    className
  );

  return (
    <div className="w-full relative" ref={selectRef}>
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-neutral-700 mb-1"
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>

      {/* Select Trigger */}
      <div
        id={inputId}
        className={selectStyles}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        role="combobox"
        aria-controls={`${inputId}-listbox`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (!disabled) {
              setIsOpen(!isOpen);
            }
          }
        }}
      >
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'truncate',
              !selectedOption && 'text-neutral-400'
            )}
          >
            {displayValue}
          </span>
          <div className="flex items-center gap-1">
            {value && !disabled && (
              <button
                onClick={handleClear}
                className="p-1 hover:bg-neutral-200 rounded transition-colors"
                aria-label="Clear selection"
              >
                <X className="w-4 h-4 text-neutral-600" />
              </button>
            )}
            <ChevronDown
              className={cn(
                'w-5 h-5 text-neutral-600 transition-transform',
                isOpen && 'transform rotate-180'
              )}
            />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-neutral-200">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari..."
                  className="w-full pl-9 pr-3 py-2 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div id={`${inputId}-listbox`} className="overflow-y-auto max-h-48" role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2 text-sm text-neutral-500 text-center">
                Tidak ada data
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={cn(
                    'px-3 py-2 cursor-pointer transition-colors text-sm',
                    'hover:bg-neutral-100',
                    option.value === value && 'bg-neutral-200 font-medium'
                  )}
                  onClick={() => handleSelect(option.value)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Error Message */}
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
