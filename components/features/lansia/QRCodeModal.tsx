/**
 * QRCodeModal Component
 * Modal for displaying QR code after lansia creation
 */

'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Lansia } from '@/types';
import Image from 'next/image';

export interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lansia: Lansia | null;
}

/**
 * QRCodeModal Component
 * 
 * @example
 * <QRCodeModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   lansia={createdLansia}
 * />
 */
export function QRCodeModal({ isOpen, onClose, lansia }: QRCodeModalProps) {
  if (!lansia || !lansia.qr_code_url) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="QR Code Berhasil Dibuat"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Cetak QR Code
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-green-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-medium text-green-900">Data berhasil disimpan!</p>
              <p className="text-sm text-green-700">
                QR Code telah dibuat untuk lansia ini.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="inline-block p-4 bg-white border-2 border-neutral-200 rounded-xl">
            <Image
              src={lansia.qr_code_url}
              alt={`QR Code ${lansia.nama}`}
              width={250}
              height={250}
              className="mx-auto"
            />
          </div>
          <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
            <p className="font-medium text-neutral-900">{lansia.nama}</p>
            <p className="text-sm text-neutral-600">NIK: {lansia.nik}</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Catatan:</strong> QR Code ini dapat digunakan untuk pemindaian
            cepat saat pemeriksaan kesehatan. Anda dapat mencetak QR Code ini atau
            mengaksesnya kembali di menu QR Code.
          </p>
        </div>
      </div>
    </Modal>
  );
}
