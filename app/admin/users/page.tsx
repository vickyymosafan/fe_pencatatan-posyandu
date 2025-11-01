/**
 * Admin Users Management Page
 * Manage petugas accounts with CRUD operations
 */

'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import {
  CreateUserModal,
  EditUserModal,
  DeleteConfirmModal,
} from '@/components/features/users';
import { getAllUsers, createUser, updateUser, deleteUser } from '@/lib/api/users';
import { useToast } from '@/lib/hooks';
import { useDebounce } from '@/lib/hooks';
import { User, CreateUserRequest, UpdateUserRequest } from '@/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearchTerm]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await getAllUsers(currentPage, 10);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      showToast('error', 'Gagal memuat data pengguna');
      console.error('Fetch users error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateUserRequest) => {
    setIsSubmitting(true);
    try {
      const response = await createUser(data);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      showToast('success', 'Pengguna berhasil ditambahkan');
      fetchUsers();
    } catch (error) {
      showToast('error', 'Gagal menambahkan pengguna');
      console.error('Create user error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateUserRequest) => {
    setIsSubmitting(true);
    try {
      const response = await updateUser(id, data);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      showToast('success', 'Pengguna berhasil diperbarui');
      fetchUsers();
    } catch (error) {
      showToast('error', 'Gagal memperbarui pengguna');
      console.error('Update user error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const response = await deleteUser(id);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      showToast('success', 'Pengguna berhasil dihapus');
      fetchUsers();
    } catch (error) {
      showToast('error', 'Gagal menghapus pengguna');
      console.error('Delete user error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Filter users based on search term (client-side for now)
  const filteredUsers = (users || []).filter(
    (user) =>
      user.nama.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const columns: Column<User>[] = [
    {
      key: 'nama',
      header: 'Nama',
      render: (user: User) => (
        <div>
          <p className="font-medium text-neutral-900">{user.nama}</p>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (user: User) => (
        <span className="text-neutral-700">{user.email}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (user: User) => (
        <span
          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
            user.role === 'ADMIN'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          {user.role}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Tanggal Dibuat',
      render: (user: User) => (
        <span className="text-neutral-600 text-sm">
          {formatDate(user.createdAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (user: User) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(user);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit pengguna"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(user);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Hapus pengguna"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
      width: '120px',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Manajemen Pengguna</h1>
        <p className="text-neutral-600 mt-1">
          Kelola akun petugas dan admin posyandu
        </p>
      </div>

      {/* Actions Bar */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="w-full md:w-96">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-transparent"
              />
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Tambah Petugas
          </Button>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={filteredUsers as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </Card>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleUpdate}
        user={selectedUser}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={handleDelete}
        user={selectedUser}
        isLoading={isSubmitting}
      />
    </div>
  );
}
