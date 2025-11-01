/**
 * EditUserModal Component
 * Modal for editing an existing user
 */

'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Role, User, UpdateUserRequest } from '@/types';

export interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateUserRequest) => Promise<void>;
  user: User | null;
  isLoading?: boolean;
}

/**
 * EditUserModal Component
 * 
 * @example
 * <EditUserModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   onSubmit={handleUpdate}
 *   user={selectedUser}
 * />
 */
export function EditUserModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  isLoading = false,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<UpdateUserRequest>({
    nama: '',
    email: '',
    password: '',
    role: Role.PETUGAS,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize form data when user prop changes
  const initialFormData = user
    ? {
        nama: user.nama,
        email: user.email,
        password: '',
        role: user.role,
      }
    : {
        nama: '',
        email: '',
        password: '',
        role: Role.PETUGAS,
      };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen && user) {
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

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = 'Password minimal 8 karakter';
      } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
        newErrors.password = 'Password harus mengandung huruf dan angka';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !validateForm()) {
      return;
    }

    // Only send fields that have values
    const updateData: UpdateUserRequest = {};
    if (formData.nama) updateData.nama = formData.nama;
    if (formData.email) updateData.email = formData.email;
    if (formData.password) updateData.password = formData.password;
    if (formData.role) updateData.role = formData.role;

    await onSubmit(user.id, updateData);
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

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Pengguna"
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
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(value) => setFormData({ ...formData, email: value })}
          error={errors.email}
          placeholder="contoh@email.com"
        />

        <Input
          label="Password Baru"
          type="password"
          value={formData.password || ''}
          onChange={(value) => setFormData({ ...formData, password: value })}
          error={errors.password}
          placeholder="Kosongkan jika tidak ingin mengubah"
        />

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Role
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as Role })
            }
            className="input w-full border border-neutral-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
          >
            <option value={Role.PETUGAS}>Petugas</option>
            <option value={Role.ADMIN}>Admin</option>
          </select>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            <strong>Catatan:</strong> Kosongkan password jika tidak ingin mengubahnya.
          </p>
        </div>
      </form>
    </Modal>
  );
}
