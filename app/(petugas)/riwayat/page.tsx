/**
 * Petugas Riwayat Page
 * View health examination history for selected lansia
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Select, SelectOption } from '@/components/ui/Select';
import { Table, Column } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { PemeriksaanDetailModal } from '@/components/features/pemeriksaan';
import { getAllLansia } from '@/lib/api/lansia';
import { getAllPemeriksaan } from '@/lib/api/pemeriksaan';
import { useToast } from '@/lib/hooks';
import { Lansia, Pemeriksaan } from '@/types';
import { History, Search } from 'lucide-react';

export default function RiwayatPage() {
  const [lansiaOptions, setLansiaOptions] = useState<SelectOption[]>([]);
  const [selectedLansiaId, setSelectedLansiaId] = useState('');
  const [pemeriksaanList, setPemeriksaanList] = useState<Pemeriksaan[]>([]);
  const [selectedPemeriksaan, setSelectedPemeriksaan] = useState<Pemeriksaan | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingLansia, setIsLoadingLansia] = useState(true);
  const [isLoadingPemeriksaan, setIsLoadingPemeriksaan] = useState(false);
  
  const { showToast } = useToast();

  // Fetch lansia list on mount
  useEffect(() => {
    fetchLansiaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch pemeriksaan when lansia is selected
  useEffect(() => {
    if (selectedLansiaId) {
      fetchPemeriksaanList(selectedLansiaId);
    } else {
      setPemeriksaanList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLansiaId]);

  const fetchLansiaList = async () => {
    setIsLoadingLansia(true);
    try {
      const response = await getAllLansia(1, 1000);
      
      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        const options: SelectOption[] = response.data.data.map((lansia: Lansia) => ({
          value: lansia.id,
          label: `${lansia.nama} - ${lansia.nik}`,
        }));
        setLansiaOptions(options);
      }
    } catch (error) {
      showToast('error', 'Gagal memuat data lansia');
      console.error('Fetch lansia error:', error);
    } finally {
      setIsLoadingLansia(false);
    }
  };

  const fetchPemeriksaanList = async (lansiaId: string) => {
    setIsLoadingPemeriksaan(true);
    try {
      const response = await getAllPemeriksaan(lansiaId, 1, 1000);
      
      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        // Sort by tanggal descending (newest first)
        const sortedData = [...response.data.data].sort(
          (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        );
        setPemeriksaanList(sortedData);
      }
    } catch (error) {
      showToast('error', 'Gagal memuat riwayat pemeriksaan');
      console.error('Fetch pemeriksaan error:', error);
    } finally {
      setIsLoadingPemeriksaan(false);
    }
  };

  const handleRowClick = (pemeriksaan: Pemeriksaan) => {
    setSelectedPemeriksaan(pemeriksaan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPemeriksaan(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const columns: Column<Pemeriksaan>[] = [
    {
      key: 'tanggal',
      header: 'Tanggal',
      width: '15%',
      render: (row) => formatDate(row.tanggal),
    },
    {
      key: 'tekanan_darah',
      header: 'Tekanan Darah',
      width: '15%',
      render: (row) => `${row.tekanan_darah} mmHg`,
    },
    {
      key: 'berat_badan',
      header: 'Berat Badan',
      width: '12%',
      render: (row) => `${row.berat_badan} kg`,
    },
    {
      key: 'gula_darah',
      header: 'Gula Darah',
      width: '12%',
      render: (row) => `${row.gula_darah} mg/dL`,
    },
    {
      key: 'kolesterol',
      header: 'Kolesterol',
      width: '12%',
      render: (row) => `${row.kolesterol} mg/dL`,
    },
    {
      key: 'keluhan',
      header: 'Keluhan',
      width: '20%',
      render: (row) => (
        <span className="line-clamp-2" title={row.keluhan}>
          {row.keluhan || '-'}
        </span>
      ),
    },
    {
      key: 'user',
      header: 'Petugas',
      width: '14%',
      render: (row) => row.user?.nama || '-',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Riwayat Pemeriksaan</h1>
        <p className="text-neutral-600 mt-1">
          Lihat riwayat pemeriksaan kesehatan lansia
        </p>
      </div>

      {/* Search Card */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-neutral-600" />
          <h3 className="font-semibold text-neutral-900">Cari Lansia</h3>
        </div>
        
        {isLoadingLansia ? (
          <Skeleton className="h-12 w-full" />
        ) : (
          <Select
            label="Pilih Lansia"
            value={selectedLansiaId}
            onChange={setSelectedLansiaId}
            options={lansiaOptions}
            placeholder="Cari berdasarkan nama atau NIK..."
            searchable
          />
        )}
      </Card>

      {/* Riwayat Table */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-neutral-600" />
          <h3 className="font-semibold text-neutral-900">Riwayat Pemeriksaan</h3>
        </div>

        {!selectedLansiaId ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Pilih Lansia
            </h3>
            <p className="text-neutral-600">
              Silakan pilih lansia terlebih dahulu untuk melihat riwayat pemeriksaan
            </p>
          </div>
        ) : isLoadingPemeriksaan ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : pemeriksaanList.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <History className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Belum Ada Riwayat
            </h3>
            <p className="text-neutral-600">
              Lansia ini belum memiliki riwayat pemeriksaan
            </p>
          </div>
        ) : (
          <Table
            columns={columns as unknown as Column<Record<string, unknown>>[]}
            data={pemeriksaanList as unknown as Record<string, unknown>[]}
            onRowClick={handleRowClick as unknown as (row: Record<string, unknown>) => void}
          />
        )}
      </Card>

      {/* Detail Modal */}
      <PemeriksaanDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pemeriksaan={selectedPemeriksaan}
      />
    </div>
  );
}
