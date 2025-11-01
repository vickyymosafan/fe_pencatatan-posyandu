/**
 * DeleteConfirmModal Component
 * Confirmation dialog for deleting a lansia record
 */

'use client';

import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Lansia } from '@/types';

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
  lansia: Lansia | null;
  isLoading?: boolean;
}

/**
 * DeleteConfirmModal Component
 * 
 * @example
 * <DeleteConfirmModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onConfirm={handleDelete}
 *   lansia={selectedLansia}
 * />
 */
export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  lansia,
  isLoading = false,
}: DeleteConfirmModalProps) {
  const handleConfirm = async () => {
    if (!lansia) return;
    await onConfirm(lansia.id);
    onClose();
  };

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Konfirmasi Hapus"
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Hapus
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <svg
            className="w-6 h-6 text-red-600 flex-shrink-0"
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
          <div>
            <p className="font-medium text-red-900">Peringatan!</p>
            <p className="text-sm text-red-700">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
        </div>

        <div>
          <p className="text-neutral-700">
            Apakah Anda yakin ingin menghapus data lansia berikut?
          </p>
          <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg space-y-2">
            <div>
              <p className="font-medium text-neutral-900">{lansia.nama}</p>
              <p className="text-sm text-neutral-600">NIK: {lansia.nik}</p>
              <p className="text-sm text-neutral-600">
                Umur: {calculateAge(lansia.tanggal_lahir)} tahun
              </p>
            </div>
            <div className="pt-2 border-t border-neutral-200">
              <p className="text-xs text-neutral-500">
                Semua data pemeriksaan terkait juga akan terhapus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
