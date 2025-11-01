/**
 * Admin QR Code Page
 * Display and print QR codes for all registered lansia
 */

'use client';

import { useState, useEffect } from 'react';
import { Printer } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { QRCodeCard } from '@/components/features/qrcode';
import { getAllLansia } from '@/lib/api/lansia';
import { useToast } from '@/lib/hooks';
import { Lansia } from '@/types';

export default function QRCodePage() {
  const [lansiaList, setLansiaList] = useState<Lansia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchAllLansia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllLansia = async () => {
    setIsLoading(true);
    try {
      // Fetch all lansia with pagination (max limit is 100 per backend validation)
      let allLansia: Lansia[] = [];
      let currentPage = 1;
      let hasMoreData = true;

      while (hasMoreData) {
        const response = await getAllLansia(currentPage, 100);

        if (response.error) {
          showToast('error', response.error);
          return;
        }

        if (response.data && response.data.data && Array.isArray(response.data.data)) {
          allLansia = [...allLansia, ...response.data.data];
          
          // Check if there are more pages
          if (currentPage >= response.data.pagination.totalPages) {
            hasMoreData = false;
          } else {
            currentPage++;
          }
        } else {
          hasMoreData = false;
        }
      }

      // Filter only lansia with QR codes
      const lansiaWithQR = allLansia.filter(
        (lansia) => lansia.qr_code_url !== null
      );
      setLansiaList(lansiaWithQR);
    } catch (error) {
      showToast('error', 'Gagal memuat data QR Code');
      console.error('Fetch lansia error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintAll = () => {
    window.print();
  };

  const handlePrintSingle = (lansiaId: string) => {
    // For single print, we'll use a simple approach:
    // Hide all cards except the selected one, then print
    const cards = document.querySelectorAll('[data-qr-card]');
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      if (cardElement.dataset.qrCard !== lansiaId) {
        cardElement.style.display = 'none';
      }
    });

    window.print();

    // Restore all cards after print
    cards.forEach((card) => {
      const cardElement = card as HTMLElement;
      cardElement.style.display = '';
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="no-print">
        <h1 className="text-3xl font-bold text-neutral-900">QR Code Lansia</h1>
        <p className="text-neutral-600 mt-1">
          Lihat dan cetak QR Code untuk semua lansia terdaftar
        </p>
      </div>

      {/* Actions Bar */}
      <Card className="no-print">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="text-sm text-neutral-600">
              Total QR Code: <span className="font-semibold text-neutral-900">{lansiaList.length}</span>
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handlePrintAll}
            disabled={lansiaList.length === 0}
            className="w-full sm:w-auto"
          >
            <Printer className="w-5 h-5 mr-2" />
            Cetak Semua
          </Button>
        </div>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="space-y-4">
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="h-6 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
              <Skeleton className="h-10 w-full" />
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && lansiaList.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-neutral-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Belum Ada QR Code
            </h3>
            <p className="text-neutral-600">
              Belum ada lansia dengan QR Code. Tambahkan data lansia terlebih dahulu.
            </p>
          </div>
        </Card>
      )}

      {/* QR Code Grid */}
      {!isLoading && lansiaList.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {lansiaList.map((lansia) => (
            <div key={lansia.id} data-qr-card={lansia.id}>
              <QRCodeCard lansia={lansia} onPrint={handlePrintSingle} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
