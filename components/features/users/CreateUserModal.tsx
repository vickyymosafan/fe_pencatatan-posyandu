/**
 * CreateUserModal Component
 * Modal for creating a new user (petugas)
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Role, CreateUserRequest } from '@/types';

export interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserRequest) => Promise<void>;
  isLoading?: boolean;
}

/**
 * CreateUserModal Component
 * 
 * @example
 * <CreateUserModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onSubmit={handleCreate}
 * />
 */
export function CreateUserModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState<CreateUserRequest>({
    nama: '',
    email: '',
    password: '',
    role: Role.PETUGAS,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) {
      newErrors.nama = 'Nama wajib diisi';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf dan angka';
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
      email: '',
      password: '',
      role: Role.PETUGAS,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tambah Petugas"
      size="md"
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
          label="Email"
          type="email"
          value={formData.email}
          onChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
          required
          placeholder="contoh@email.com"
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => setFormData({ ...formData, password: value })}
          error={errors.password}
          required
          placeholder="Minimal 8 karakter"
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Role <span className="text-red-600">*</span>
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as Role })
            }
            className="input w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
            required
          >
            <option value={Role.PETUGAS}>Petugas</option>
            <option value={Role.ADMIN}>Admin</option>
          </select>
        </div>
      </form>
    </Modal>
  );
}
