/**
 * Admin Lansia Management Page
 * Manage elderly (lansia) records with CRUD operations
 */

'use client';

import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Table, Column } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import {
  CreateLansiaModal,
  EditLansiaModal,
  DeleteConfirmModal,
  QRCodeModal,
} from '@/components/features/lansia';
import {
  getAllLansia,
  createLansia,
  updateLansia,
  deleteLansia,
} from '@/lib/api/lansia';
import { useToast, useDebounce } from '@/lib/hooks';
import { Lansia, CreateLansiaRequest, UpdateLansiaRequest } from '@/types';

export default function LansiaPage() {
  const [lansiaList, setLansiaList] = useState<Lansia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false);
  const [selectedLansia, setSelectedLansia] = useState<Lansia | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    fetchLansia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, debouncedSearchTerm]);

  const fetchLansia = async () => {
    setIsLoading(true);
    try {
      const response = await getAllLansia(currentPage, 10, debouncedSearchTerm);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        setLansiaList(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      showToast('error', 'Gagal memuat data lansia');
      console.error('Fetch lansia error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: CreateLansiaRequest) => {
    setIsSubmitting(true);
    try {
      const response = await createLansia(data);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        showToast('success', 'Data lansia berhasil ditambahkan');
        fetchLansia();
        // Show QR code modal after successful creation
        setSelectedLansia(response.data);
        setIsQRCodeModalOpen(true);
      }
    } catch (error) {
      showToast('error', 'Gagal menambahkan data lansia');
      console.error('Create lansia error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (id: string, data: UpdateLansiaRequest) => {
    setIsSubmitting(true);
    try {
      const response = await updateLansia(id, data);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      showToast('success', 'Data lansia berhasil diperbarui');
      fetchLansia();
    } catch (error) {
      showToast('error', 'Gagal memperbarui data lansia');
      console.error('Update lansia error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const response = await deleteLansia(id);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      showToast('success', 'Data lansia berhasil dihapus');
      fetchLansia();
    } catch (error) {
      showToast('error', 'Gagal menghapus data lansia');
      console.error('Delete lansia error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (lansia: Lansia) => {
    setSelectedLansia(lansia);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (lansia: Lansia) => {
    setSelectedLansia(lansia);
    setIsDeleteModalOpen(true);
  };

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

  const columns: Column<Lansia>[] = [
    {
      key: 'nama',
      header: 'Nama',
      render: (lansia: Lansia) => (
        <div>
          <p className="font-medium text-neutral-900">{lansia.nama}</p>
        </div>
      ),
    },
    {
      key: 'nik',
      header: 'NIK',
      render: (lansia: Lansia) => (
        <span className="text-neutral-700 font-mono text-sm">{lansia.nik}</span>
      ),
    },
    {
      key: 'umur',
      header: 'Umur',
      render: (lansia: Lansia) => (
        <span className="text-neutral-700">
          {calculateAge(lansia.tanggal_lahir)} tahun
        </span>
      ),
      width: '100px',
    },
    {
      key: 'alamat',
      header: 'Alamat',
      render: (lansia: Lansia) => (
        <span className="text-neutral-600 text-sm line-clamp-2">
          {lansia.alamat}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Aksi',
      render: (lansia: Lansia) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick(lansia);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit lansia"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(lansia);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Hapus lansia"
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
        <h1 className="text-3xl font-bold text-neutral-900">Data Lansia</h1>
        <p className="text-neutral-600 mt-1">
          Kelola data lanjut usia yang terdaftar di posyandu
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
                placeholder="Cari nama atau NIK..."
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
            Tambah Lansia
          </Button>
        </div>
      </Card>

      {/* Lansia Table */}
      <Card>
        <Table
          columns={columns as unknown as Column<Record<string, unknown>>[]}
          data={lansiaList as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          pagination={{
            currentPage,
            totalPages,
            onPageChange: setCurrentPage,
          }}
        />
      </Card>

      {/* Modals */}
      <CreateLansiaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
        isLoading={isSubmitting}
      />

      <EditLansiaModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLansia(null);
        }}
        onSubmit={handleUpdate}
        lansia={selectedLansia}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedLansia(null);
        }}
        onConfirm={handleDelete}
        lansia={selectedLansia}
        isLoading={isSubmitting}
      />

      <QRCodeModal
        isOpen={isQRCodeModalOpen}
        onClose={() => {
          setIsQRCodeModalOpen(false);
          setSelectedLansia(null);
        }}
        lansia={selectedLansia}
      />
    </div>
  );
}
