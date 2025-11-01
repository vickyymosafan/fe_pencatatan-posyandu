/**
 * Petugas QR Scanner Page
 * Scan QR codes to quickly access lansia information
 */

'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { LansiaDetailModal } from '@/components/features/scanner';
import { getLansiaById } from '@/lib/api/lansia';
import { useToast } from '@/lib/hooks';
import { LansiaWithPemeriksaan } from '@/types';
import { Scan } from 'lucide-react';

// Dynamically import QRScanner to optimize bundle size
const QRScanner = dynamic(
  () => import('@/components/features/scanner').then((mod) => mod.QRScanner),
  {
    loading: () => (
      <Card>
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="text-center">
            <p className="text-neutral-600">Memuat scanner...</p>
          </div>
        </div>
      </Card>
    ),
    ssr: false, // Disable SSR for camera component
  }
);

export default function ScanPage() {
  const [scannedLansia, setScannedLansia] = useState<LansiaWithPemeriksaan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleScanSuccess = async (decodedText: string) => {
    setIsLoading(true);
    
    try {
      // Extract lansia ID from QR code
      // Assuming QR code contains just the ID or a URL with the ID
      let lansiaId = decodedText;
      
      // If QR code is a URL, extract the ID
      if (decodedText.includes('/')) {
        const parts = decodedText.split('/');
        lansiaId = parts[parts.length - 1];
      }

      // Fetch lansia data
      const response = await getLansiaById(lansiaId);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        setScannedLansia(response.data);
        setIsModalOpen(true);
        showToast('success', 'QR Code berhasil dipindai!');
      }
    } catch (error) {
      showToast('error', 'QR Code tidak valid atau lansia tidak ditemukan');
      console.error('Scan error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanError = (error: string) => {
    showToast('error', error);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setScannedLansia(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Scan QR Code</h1>
        <p className="text-neutral-600 mt-1">
          Pindai QR Code lansia untuk melihat data dan melakukan pemeriksaan
        </p>
      </div>

      {/* Scanner Section */}
      <div className="max-w-2xl mx-auto">
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onScanError={handleScanError}
        />
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <Card className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <Scan className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-neutral-900 font-medium">Memuat data lansia...</p>
            <p className="text-sm text-neutral-600 mt-1">Mohon tunggu sebentar</p>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="max-w-2xl mx-auto no-print">
        <h3 className="font-semibold text-neutral-900 mb-3">Cara Menggunakan</h3>
        <ol className="space-y-2 text-sm text-neutral-700">
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center text-xs font-semibold">
              1
            </span>
            <span>Pastikan kamera memiliki izin akses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center text-xs font-semibold">
              2
            </span>
            <span>Arahkan kamera ke QR Code pada kartu lansia</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center text-xs font-semibold">
              3
            </span>
            <span>Tunggu hingga QR Code terbaca secara otomatis</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="flex-shrink-0 w-6 h-6 bg-neutral-200 rounded-full flex items-center justify-center text-xs font-semibold">
              4
            </span>
            <span>Data lansia akan ditampilkan dan Anda dapat melanjutkan ke input pemeriksaan</span>
          </li>
        </ol>
      </Card>

      {/* Lansia Detail Modal */}
      <LansiaDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        lansia={scannedLansia}
      />
    </div>
  );
}
