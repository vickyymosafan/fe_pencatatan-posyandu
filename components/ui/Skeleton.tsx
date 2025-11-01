/**
 * Skeleton Component
 * Loading placeholder with pulse animation
 * Follows design system specifications
 */

'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

/**
 * Skeleton Component
 * 
 * @example
 * <Skeleton className="h-12 w-full" />
 * <Skeleton variant="circular" width={40} height={40} />
 */
export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  style: externalStyle,
}: SkeletonProps) {
  const variantStyles = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = { ...externalStyle };
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'animate-pulse bg-neutral-200',
        variantStyles[variant],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
}

/**
 * SkeletonText Component
 * Multiple lines of skeleton text
 */
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  // Generate stable widths based on line index
  const widths = Array.from({ length: lines }, (_, i) => {
    const baseWidth = 70;
    const variation = (i % 3) * 10; // 0, 10, or 20
    return `${baseWidth + variation}%`;
  });

  return (
    <div className="space-y-2">
      {widths.map((width, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width }}
        />
      ))}
    </div>
  );
}
