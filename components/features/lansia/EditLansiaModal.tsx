/**
 * EditLansiaModal Component
 * Modal for editing an existing lansia record
 */

'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Lansia, UpdateLansiaRequest } from '@/types';

export interface EditLansiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateLansiaRequest) => Promise<void>;
  lansia: Lansia | null;
  isLoading?: boolean;
}

/**
 * EditLansiaModal Component
 * 
 * @example
 * <EditLansiaModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onSubmit={handleUpdate}
 *   lansia={selectedLansia}
 * />
 */
export function EditLansiaModal({
  isOpen,
  onClose,
  onSubmit,
  lansia,
  isLoading = false,
}: EditLansiaModalProps) {
  const [formData, setFormData] = useState<UpdateLansiaRequest>({
    nama: '',
    nik: '',
    tanggal_lahir: '',
    alamat: '',
    penyakit_bawaan: '',
    kontak_keluarga: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when lansia prop changes
  const initialFormData = lansia
    ? {
        nama: lansia.nama,
        nik: lansia.nik,
        tanggal_lahir: lansia.tanggal_lahir.split('T')[0], // Format date for input
        alamat: lansia.alamat,
        penyakit_bawaan: lansia.penyakit_bawaan,
        kontak_keluarga: lansia.kontak_keluarga,
      }
    : {
        nama: '',
        nik: '',
        tanggal_lahir: '',
        alamat: '',
        penyakit_bawaan: '',
        kontak_keluarga: '',
      };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && lansia) {
      setFormData(initialFormData);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.nama && !formData.nama.trim()) {
      newErrors.nama = 'Nama tidak boleh kosong';
    }

    if (formData.nik) {
      if (!/^\d{16}$/.test(formData.nik)) {
        newErrors.nik = 'NIK harus 16 digit angka';
      }
    }

    if (formData.tanggal_lahir) {
      const birthDate = new Date(formData.tanggal_lahir);
      const today = new Date();
      if (birthDate > today) {
        newErrors.tanggal_lahir = 'Tanggal lahir tidak boleh di masa depan';
      }
    }

    if (formData.alamat && !formData.alamat.trim()) {
      newErrors.alamat = 'Alamat tidak boleh kosong';
    }

    if (formData.kontak_keluarga && !formData.kontak_keluarga.trim()) {
      newErrors.kontak_keluarga = 'Kontak keluarga tidak boleh kosong';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!lansia || !validateForm()) {
      return;
    }

    // Only send fields that have values
    const updateData: UpdateLansiaRequest = {};
    if (formData.nama) updateData.nama = formData.nama;
    if (formData.nik) updateData.nik = formData.nik;
    if (formData.tanggal_lahir) updateData.tanggal_lahir = formData.tanggal_lahir;
    if (formData.alamat) updateData.alamat = formData.alamat;
    if (formData.penyakit_bawaan !== undefined)
      updateData.penyakit_bawaan = formData.penyakit_bawaan;
    if (formData.kontak_keluarga) updateData.kontak_keluarga = formData.kontak_keluarga;

    await onSubmit(lansia.id, updateData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nama: '',
      nik: '',
      tanggal_lahir: '',
      alamat: '',
      penyakit_bawaan: '',
      kontak_keluarga: '',
    });
    setErrors({});
    onClose();
  };

  if (!lansia) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Data Lansia"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isLoading}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={isLoading}
          >
            Simpan Perubahan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Lengkap"
          type="text"
          value={formData.nama || ''}
          onChange={(value) => setFormData({ ...formData, nama: value })}
          error={errors.nama}
          placeholder="Masukkan nama lengkap"
        />

        <Input
          label="NIK"
          type="text"
          value={formData.nik || ''}
          onChange={(value) => setFormData({ ...formData, nik: value })}
          error={errors.nik}
          placeholder="16 digit NIK"
        />

        <Input
          label="Tanggal Lahir"
          type="date"
          value={formData.tanggal_lahir || ''}
          onChange={(value) => setFormData({ ...formData, tanggal_lahir: value })}
          error={errors.tanggal_lahir}
        />

        <Input
          label="Alamat"
          type="textarea"
          value={formData.alamat || ''}
          onChange={(value) => setFormData({ ...formData, alamat: value })}
          error={errors.alamat}
          placeholder="Masukkan alamat lengkap"
          rows={3}
        />

        <Input
          label="Penyakit Bawaan"
          type="textarea"
          value={formData.penyakit_bawaan || ''}
          onChange={(value) => setFormData({ ...formData, penyakit_bawaan: value })}
          error={errors.penyakit_bawaan}
          placeholder="Kosongkan jika tidak ada"
          rows={2}
        />

        <Input
          label="Kontak Keluarga"
          type="tel"
          value={formData.kontak_keluarga || ''}
          onChange={(value) => setFormData({ ...formData, kontak_keluarga: value })}
          error={errors.kontak_keluarga}
          placeholder="Nomor telepon keluarga"
        />
      </form>
    </Modal>
  );
}
