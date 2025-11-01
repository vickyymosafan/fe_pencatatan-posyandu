/**
 * StatCard Component
 * Displays a single statistic with icon, label, and value
 * Used in dashboard pages
 */

'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

/**
 * StatCard Component
 * 
 * @example
 * <StatCard
 *   label="Total Lansia"
 *   value={150}
 *   icon={Users}
 *   iconColor="text-blue-600"
 *   iconBgColor="bg-blue-100"
 * />
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'text-neutral-800',
  iconBgColor = 'bg-neutral-100',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-shadow', className)}>
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
            iconBgColor
          )}
        >
          <Icon className={cn('w-6 h-6', iconColor)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-neutral-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-neutral-900 truncate">{value}</p>
        </div>
      </div>
    </Card>
  );
}
