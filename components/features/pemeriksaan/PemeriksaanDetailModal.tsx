/**
 * Pemeriksaan Detail Modal
 * Displays detailed information about a health examination record
 */

'use client';

import { Modal } from '@/components/ui/Modal';
import { Pemeriksaan } from '@/types';
import { Calendar, User, Activity, Weight, Droplet, Heart, FileText } from 'lucide-react';

interface PemeriksaanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pemeriksaan: Pemeriksaan | null;
}

export function PemeriksaanDetailModal({
  isOpen,
  onClose,
  pemeriksaan,
}: PemeriksaanDetailModalProps) {
  if (!pemeriksaan) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detail Pemeriksaan"
      size="lg"
    >
      <div className="space-y-6">
        {/* Tanggal dan Waktu */}
        <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg">
          <Calendar className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-neutral-600">Tanggal Pemeriksaan</p>
            <p className="font-medium text-neutral-900">{formatDate(pemeriksaan.tanggal)}</p>
            <p className="text-sm text-neutral-600 mt-1">Pukul {formatTime(pemeriksaan.tanggal)}</p>
          </div>
        </div>

        {/* Data Lansia */}
        {pemeriksaan.lansia && (
          <div>
            <h4 className="font-semibold text-neutral-900 mb-3">Data Lansia</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-neutral-600">Nama Lengkap</p>
                  <p className="font-medium text-neutral-900">{pemeriksaan.lansia.nama}</p>
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
                <div>
                  <p className="text-sm text-neutral-600">NIK</p>
                  <p className="font-mono text-neutral-900">{pemeriksaan.lansia.nik}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hasil Pemeriksaan */}
        <div>
          <h4 className="font-semibold text-neutral-900 mb-3">Hasil Pemeriksaan</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg">
              <Activity className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-neutral-600">Tekanan Darah</p>
                <p className="text-lg font-semibold text-neutral-900">{pemeriksaan.tekanan_darah}</p>
                <p className="text-xs text-neutral-500">mmHg</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg">
              <Weight className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-neutral-600">Berat Badan</p>
                <p className="text-lg font-semibold text-neutral-900">{pemeriksaan.berat_badan}</p>
                <p className="text-xs text-neutral-500">kg</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg">
              <Droplet className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-neutral-600">Gula Darah</p>
                <p className="text-lg font-semibold text-neutral-900">{pemeriksaan.gula_darah}</p>
                <p className="text-xs text-neutral-500">mg/dL</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg">
              <Heart className="w-5 h-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-neutral-600">Kolesterol</p>
                <p className="text-lg font-semibold text-neutral-900">{pemeriksaan.kolesterol}</p>
                <p className="text-xs text-neutral-500">mg/dL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Keluhan */}
        {pemeriksaan.keluhan && (
          <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg">
            <FileText className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-neutral-600 mb-1">Keluhan</p>
              <p className="text-neutral-900">{pemeriksaan.keluhan}</p>
            </div>
          </div>
        )}

        {/* Petugas */}
        {pemeriksaan.user && (
          <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg">
            <User className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-neutral-600">Diperiksa oleh</p>
              <p className="font-medium text-neutral-900">{pemeriksaan.user.nama}</p>
              <p className="text-sm text-neutral-600">{pemeriksaan.user.email}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
