/**
 * CreateLansiaModal Component
 * Modal for creating a new lansia record
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreateLansiaRequest } from '@/types';

export interface CreateLansiaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLansiaRequest) => Promise<void>;
  isLoading?: boolean;
}

/**
 * CreateLansiaModal Component
 * 
 * @example
 * <CreateLansiaModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onSubmit={handleCreate}
 * />
 */
export function CreateLansiaModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateLansiaModalProps) {
  const [formData, setFormData] = useState<CreateLansiaRequest>({
    nama: '',
    nik: '',
    tanggal_lahir: '',
    alamat: '',
    penyakit_bawaan: '',
    kontak_keluarga: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    }

    if (!formData.nik.trim()) {
      newErrors.nik = 'NIK wajib diisi';
    } else if (!/^\d{16}$/.test(formData.nik)) {
      newErrors.nik = 'NIK harus 16 digit angka';
    }

    if (!formData.tanggal_lahir) {
      newErrors.tanggal_lahir = 'Tanggal lahir wajib diisi';
    } else {
      const birthDate = new Date(formData.tanggal_lahir);
      const today = new Date();
      if (birthDate > today) {
        newErrors.tanggal_lahir = 'Tanggal lahir tidak boleh di masa depan';
      }
    }

    if (!formData.alamat.trim()) {
      newErrors.alamat = 'Alamat wajib diisi';
    }

    if (!formData.kontak_keluarga.trim()) {
      newErrors.kontak_keluarga = 'Kontak keluarga wajib diisi';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah Data Lansia"
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
            Simpan
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nama Lengkap"
          type="text"
          value={formData.nama}
          onChange={(value) => setFormData({ ...formData, nama: value })}
          error={errors.nama}
          required
          placeholder="Masukkan nama lengkap"
        />

        <Input
          label="NIK"
          type="text"
          value={formData.nik}
          onChange={(value) => setFormData({ ...formData, nik: value })}
          error={errors.nik}
          required
          placeholder="16 digit NIK"
        />

        <Input
          label="Tanggal Lahir"
          type="date"
          value={formData.tanggal_lahir}
          onChange={(value) => setFormData({ ...formData, tanggal_lahir: value })}
          error={errors.tanggal_lahir}
          required
        />

        <Input
          label="Alamat"
          type="textarea"
          value={formData.alamat}
          onChange={(value) => setFormData({ ...formData, alamat: value })}
          error={errors.alamat}
          required
          placeholder="Masukkan alamat lengkap"
          rows={3}
        />

        <Input
          label="Penyakit Bawaan"
          type="textarea"
          value={formData.penyakit_bawaan}
          onChange={(value) => setFormData({ ...formData, penyakit_bawaan: value })}
          error={errors.penyakit_bawaan}
          placeholder="Kosongkan jika tidak ada"
          rows={2}
        />

        <Input
          label="Kontak Keluarga"
          type="tel"
          value={formData.kontak_keluarga}
          onChange={(value) => setFormData({ ...formData, kontak_keluarga: value })}
          error={errors.kontak_keluarga}
          required
          placeholder="Nomor telepon keluarga"
        />
      </form>
    </Modal>
  );
}
