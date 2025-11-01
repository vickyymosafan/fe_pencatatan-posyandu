/**
 * LansiaDetailModal Component
 * Displays lansia details after QR code scan with option to input pemeriksaan
 */

'use client';

import { useRouter } from 'next/navigation';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LansiaWithPemeriksaan } from '@/types';
import { ClipboardEdit, User, Calendar, MapPin, Heart, Phone } from 'lucide-react';

export interface LansiaDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lansia: LansiaWithPemeriksaan | null;
}

/**
 * LansiaDetailModal Component
 * Shows detailed information about scanned lansia
 * 
 * @example
 * <LansiaDetailModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   lansia={lansiaData}
 * />
 */
export function LansiaDetailModal({
  isOpen,
  onClose,
  lansia,
}: LansiaDetailModalProps) {
  const router = useRouter();

  if (!lansia) return null;

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getLastPemeriksaan = () => {
    if (!lansia.pemeriksaan || lansia.pemeriksaan.length === 0) {
      return null;
    }
    
    // Sort by date descending and get the first one
    const sorted = [...lansia.pemeriksaan].sort(
      (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
    );
    return sorted[0];
  };

  const lastPemeriksaan = getLastPemeriksaan();

  const handleInputPemeriksaan = () => {
    router.push(`/petugas/input?lansiaId=${lansia.id}`);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Data Lansia"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleInputPemeriksaan}>
            <ClipboardEdit className="w-4 h-4 mr-2" />
            Input Pemeriksaan
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        {/* Success indicator */}
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
              <p className="font-medium text-green-900">QR Code Berhasil Dipindai!</p>
              <p className="text-sm text-green-700">
                Data lansia ditemukan dalam sistem
              </p>
            </div>
          </div>
        </div>

        {/* Lansia Information */}
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Nama Lengkap</p>
              <p className="font-semibold text-neutral-900">{lansia.nama}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <svg
              className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm text-neutral-600">NIK</p>
              <p className="font-mono text-neutral-900">{lansia.nik}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Tanggal Lahir / Umur</p>
              <p className="text-neutral-900">
                {new Date(lansia.tanggal_lahir).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}{' '}
                <span className="text-neutral-600">
                  ({calculateAge(lansia.tanggal_lahir)} tahun)
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Alamat</p>
              <p className="text-neutral-900">{lansia.alamat}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Penyakit Bawaan</p>
              <p className="text-neutral-900">{lansia.penyakit_bawaan || '-'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-neutral-600">Kontak Keluarga</p>
              <p className="text-neutral-900">{lansia.kontak_keluarga}</p>
            </div>
          </div>
        </div>

        {/* Last Pemeriksaan */}
        {lastPemeriksaan ? (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-3">
              Pemeriksaan Terakhir
            </h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-blue-700">Tanggal</p>
                <p className="font-medium text-blue-900">
                  {new Date(lastPemeriksaan.tanggal).toLocaleDateString('id-ID', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <div>
                <p className="text-blue-700">Tekanan Darah</p>
                <p className="font-medium text-blue-900">
                  {lastPemeriksaan.tekanan_darah} mmHg
                </p>
              </div>
              <div>
                <p className="text-blue-700">Berat Badan</p>
                <p className="font-medium text-blue-900">
                  {lastPemeriksaan.berat_badan} kg
                </p>
              </div>
              <div>
                <p className="text-blue-700">Gula Darah</p>
                <p className="font-medium text-blue-900">
                  {lastPemeriksaan.gula_darah} mg/dL
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Catatan:</strong> Belum ada riwayat pemeriksaan untuk lansia ini.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
