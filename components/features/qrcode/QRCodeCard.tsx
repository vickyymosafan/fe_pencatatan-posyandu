/**
 * QRCodeCard Component
 * Displays a single lansia's QR code with print functionality
 */

'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Lansia } from '@/types';
import { Printer } from 'lucide-react';
import Image from 'next/image';

export interface QRCodeCardProps {
  lansia: Lansia;
  onPrint?: (lansiaId: string) => void;
}

/**
 * QRCodeCard Component
 * Displays QR code for a single lansia with print functionality
 * 
 * @example
 * <QRCodeCard
 *   lansia={lansiaData}
 *   onPrint={handlePrint}
 * />
 */
export function QRCodeCard({ lansia, onPrint }: QRCodeCardProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint(lansia.id);
    }
  };

  // Skip rendering if no QR code URL
  if (!lansia.qr_code_url) {
    return null;
  }

  return (
    <Card className="flex flex-col items-center text-center space-y-4">
      {/* QR Code Image */}
      <div className="w-full aspect-square relative bg-white border-2 border-neutral-200 rounded-lg overflow-hidden">
        <Image
          src={lansia.qr_code_url}
          alt={`QR Code ${lansia.nama}`}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Lansia Info */}
      <div className="w-full space-y-1">
        <h3 className="font-semibold text-neutral-900 text-lg line-clamp-2">
          {lansia.nama}
        </h3>
        <p className="text-sm text-neutral-600 font-mono">
          NIK: {lansia.nik}
        </p>
      </div>

      {/* Print Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={handlePrint}
        className="w-full no-print"
      >
        <Printer className="w-4 h-4 mr-2" />
        Cetak
      </Button>
    </Card>
  );
}
