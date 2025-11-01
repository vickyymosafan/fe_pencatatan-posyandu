/**
 * Card Component
 * Reusable card container with optional title, subtitle, and footer
 * Follows design system specifications
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * Card Component
 * 
 * @example
 * <Card title="Statistics" subtitle="Monthly overview">
 *   <p>Card content here</p>
 * </Card>
 */
export function Card({
  title,
  subtitle,
  children,
  footer,
  className,
  onClick,
}: CardProps) {
  const isClickable = !!onClick;

  return (
    <div
      className={cn(
        'card bg-neutral-50 border border-neutral-200 rounded-xl p-6 shadow-custom',
        isClickable && 'cursor-pointer hover:shadow-lg hover:border-neutral-300',
        className
      )}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
          )}
          {subtitle && (
            <p className="text-sm text-neutral-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      
      <div className="card-content">{children}</div>
      
      {footer && (
        <div className="card-footer mt-4 pt-4 border-t border-neutral-200">
          {footer}
        </div>
      )}
    </div>
  );
}
