/**
 * QRScanner Component
 * Camera-based QR code scanner using html5-qrcode library
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';

export interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
}

/**
 * Check if camera permissions are granted
 */
async function checkCameraPermission(): Promise<boolean> {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }

    // Check if running on HTTPS or localhost
    const isSecureContext = window.isSecureContext;
    if (!isSecureContext) {
      return false;
    }

    // Try to get camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' } 
    });
    
    // Stop the stream immediately after checking
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch {
    return false;
  }
}

/**
 * QRScanner Component
 * Initializes camera and scans QR codes
 * 
 * @example
 * <QRScanner
 *   onScanSuccess={handleScan}
 *   onScanError={handleError}
 * />
 */
export function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'permission' | 'https' | 'general'>('general');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isScanning = useRef(false);

  const initScanner = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if running on HTTPS or localhost
      if (!window.isSecureContext) {
        setError('Kamera hanya dapat diakses melalui HTTPS atau localhost');
        setErrorType('https');
        setIsLoading(false);
        if (onScanError) {
          onScanError('HTTPS required');
        }
        return;
      }

      // Check camera permission
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        setError('Izin akses kamera ditolak atau tidak tersedia');
        setErrorType('permission');
        setIsLoading(false);
        if (onScanError) {
          onScanError('Camera permission denied');
        }
        return;
      }

      // Create scanner instance
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      // Start scanning
      await scanner.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10, // Frames per second
          qrbox: { width: 250, height: 250 }, // Scanning box size
        },
        (decodedText) => {
          // Prevent multiple scans
          if (!isScanning.current) {
            isScanning.current = true;
            onScanSuccess(decodedText);
            
            // Reset after 2 seconds to allow re-scanning
            setTimeout(() => {
              isScanning.current = false;
            }, 2000);
          }
        },
        (errorMessage) => {
          // Ignore common scanning errors (no QR code in frame)
          // Only log actual errors
          if (!errorMessage.includes('No MultiFormat Readers')) {
            console.debug('QR scan error:', errorMessage);
          }
        }
      );

      setIsLoading(false);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengakses kamera';
      setError(errorMsg);
      setErrorType('general');
      setIsLoading(false);
      
      if (onScanError) {
        onScanError(errorMsg);
      }
    }
  };

  useEffect(() => {
    initScanner();

    // Cleanup on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch((err) => {
            console.error('Error stopping scanner:', err);
          });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Card>
        <div className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-lg" />
          <div className="text-center">
            <p className="text-neutral-600">Memuat kamera...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            Gagal Mengakses Kamera
          </h3>
          <p className="text-neutral-600 mb-4">{error}</p>
          
          {/* Specific instructions based on error type */}
          {errorType === 'permission' && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-500">
                Pastikan Anda telah memberikan izin akses kamera
              </p>
              <div className="text-xs text-neutral-500 space-y-1">
                <p>Cara memberikan izin:</p>
                <p>1. Klik ikon kunci/info di address bar browser</p>
                <p>2. Pilih &quot;Izinkan&quot; untuk akses kamera</p>
                <p>3. Refresh halaman atau klik tombol Coba Lagi</p>
              </div>
              <Button onClick={initScanner} variant="primary" className="mt-4">
                Coba Lagi
              </Button>
            </div>
          )}
          
          {errorType === 'https' && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-500">
                Akses kamera memerlukan koneksi HTTPS yang aman
              </p>
              <p className="text-xs text-neutral-500">
                Pastikan aplikasi diakses melalui HTTPS atau localhost
              </p>
            </div>
          )}
          
          {errorType === 'general' && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-500">
                Terjadi kesalahan saat mengakses kamera
              </p>
              <Button onClick={initScanner} variant="primary" className="mt-4">
                Coba Lagi
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        {/* Scanner container */}
        <div id="qr-reader" className="w-full rounded-lg overflow-hidden" />
        
        {/* Instructions */}
        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Arahkan kamera ke QR Code lansia
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Pastikan QR Code berada dalam kotak pemindaian
          </p>
        </div>
      </div>
    </Card>
  );
}
