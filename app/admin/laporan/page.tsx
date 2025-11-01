/**
 * Admin Laporan Page
 * Generate and view health examination reports with filters and charts
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { FileDown, Filter } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { Table, Column } from '@/components/ui/Table';
import { Skeleton } from '@/components/ui/Skeleton';
import { getPemeriksaanReport } from '@/lib/api/laporan';
import { getAllLansia } from '@/lib/api/lansia';
import { useToast } from '@/lib/hooks';
import { Pemeriksaan, Lansia } from '@/types';

export default function LaporanPage() {
  // Filter states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLansiaId, setSelectedLansiaId] = useState('');
  
  // Data states
  const [pemeriksaanList, setPemeriksaanList] = useState<Pemeriksaan[]>([]);
  const [lansiaOptions, setLansiaOptions] = useState<SelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLansia, setIsLoadingLansia] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  const { showToast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  // Fetch lansia options on mount
  useEffect(() => {
    fetchLansiaOptions();
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLansiaOptions = async () => {
    setIsLoadingLansia(true);
    try {
      const response = await getAllLansia(1, 1000);
      
      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        const options: SelectOption[] = [
          { value: '', label: 'Semua Lansia' },
          ...response.data.data.map((lansia: Lansia) => ({
            value: lansia.id,
            label: `${lansia.nama} (${lansia.nik})`,
          })),
        ];
        setLansiaOptions(options);
      }
    } catch (error) {
      showToast('error', 'Gagal memuat data lansia');
      console.error('Fetch lansia error:', error);
    } finally {
      setIsLoadingLansia(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      showToast('error', 'Tanggal mulai dan tanggal akhir harus diisi');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      showToast('error', 'Tanggal mulai tidak boleh lebih besar dari tanggal akhir');
      return;
    }

    setIsLoading(true);
    try {
      const response = await getPemeriksaanReport(
        startDate,
        endDate,
        selectedLansiaId || undefined
      );

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        setPemeriksaanList(response.data);
        if (response.data.length === 0) {
          showToast('info', 'Tidak ada data pemeriksaan pada periode yang dipilih');
        } else {
          showToast('success', `Berhasil memuat ${response.data.length} data pemeriksaan`);
        }
      }
    } catch (error) {
      showToast('error', 'Gagal memuat laporan');
      console.error('Generate report error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (pemeriksaanList.length === 0) {
      showToast('error', 'Tidak ada data untuk diekspor');
      return;
    }

    setIsExporting(true);
    try {
      const element = reportRef.current;
      if (!element) return;

      // Capture the report content as canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Generate filename with date range
      const filename = `Laporan_Pemeriksaan_${startDate}_${endDate}.pdf`;
      pdf.save(filename);
      
      showToast('success', 'Laporan berhasil diekspor ke PDF');
    } catch (error) {
      showToast('error', 'Gagal mengekspor PDF');
      console.error('Export PDF error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  // Prepare chart data
  const chartData = pemeriksaanList.map((p) => ({
    tanggal: new Date(p.tanggal).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
    }),
    tekananDarah: parseFloat(p.tekanan_darah.split('/')[0]) || 0,
    gulaDarah: parseFloat(p.gula_darah) || 0,
    kolesterol: parseFloat(p.kolesterol) || 0,
  }));

  // Table columns
  const columns: Column<Pemeriksaan>[] = [
    {
      key: 'tanggal',
      header: 'Tanggal',
      render: (p: Pemeriksaan) => (
        <span className="text-sm">
          {new Date(p.tanggal).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
      width: '120px',
    },
    {
      key: 'lansia',
      header: 'Nama Lansia',
      render: (p: Pemeriksaan) => (
        <div>
          <p className="font-medium text-neutral-900">{p.lansia?.nama || '-'}</p>
          <p className="text-xs text-neutral-600">{p.lansia?.nik || '-'}</p>
        </div>
      ),
    },
    {
      key: 'tekanan_darah',
      header: 'Tekanan Darah',
      render: (p: Pemeriksaan) => (
        <span className="text-sm font-mono">{p.tekanan_darah} mmHg</span>
      ),
      width: '130px',
    },
    {
      key: 'berat_badan',
      header: 'Berat Badan',
      render: (p: Pemeriksaan) => (
        <span className="text-sm font-mono">{p.berat_badan} kg</span>
      ),
      width: '110px',
    },
    {
      key: 'gula_darah',
      header: 'Gula Darah',
      render: (p: Pemeriksaan) => (
        <span className="text-sm font-mono">{p.gula_darah} mg/dL</span>
      ),
      width: '110px',
    },
    {
      key: 'kolesterol',
      header: 'Kolesterol',
      render: (p: Pemeriksaan) => (
        <span className="text-sm font-mono">{p.kolesterol} mg/dL</span>
      ),
      width: '110px',
    },
    {
      key: 'petugas',
      header: 'Petugas',
      render: (p: Pemeriksaan) => (
        <span className="text-sm text-neutral-700">{p.user?.nama || '-'}</span>
      ),
      width: '150px',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="no-print">
        <h1 className="text-3xl font-bold text-neutral-900">Laporan Pemeriksaan</h1>
        <p className="text-neutral-600 mt-1">
          Generate dan analisis laporan pemeriksaan kesehatan lansia
        </p>
      </div>

      {/* Filter Form */}
      <Card className="no-print">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-neutral-600" />
            <h3 className="font-semibold text-neutral-900">Filter Laporan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Tanggal Mulai"
              type="date"
              value={startDate}
              onChange={setStartDate}
              required
            />
            <Input
              label="Tanggal Akhir"
              type="date"
              value={endDate}
              onChange={setEndDate}
              required
            />
            <Select
              label="Lansia"
              value={selectedLansiaId}
              onChange={setSelectedLansiaId}
              options={lansiaOptions}
              searchable
              disabled={isLoadingLansia}
              placeholder={isLoadingLansia ? 'Memuat...' : 'Semua Lansia'}
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleGenerateReport}
              isLoading={isLoading}
              disabled={!startDate || !endDate}
            >
              <Filter className="w-4 h-4 mr-2" />
              Generate Laporan
            </Button>
            <Button
              variant="secondary"
              onClick={handleExportPDF}
              isLoading={isExporting}
              disabled={pemeriksaanList.length === 0}
            >
              <FileDown className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>
      </Card>

      {/* Report Content */}
      <div ref={reportRef}>
        {/* Chart Section */}
        {pemeriksaanList.length > 0 && (
          <Card title="Tren Kesehatan" subtitle="Visualisasi data pemeriksaan">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="tanggal"
                  stroke="#737373"
                  style={{ fontSize: '12px' }}
                />
                <YAxis stroke="#737373" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fafafa',
                    border: '1px solid #e5e5e5',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tekananDarah"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Tekanan Darah (Sistolik)"
                  dot={{ fill: '#ef4444', r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="gulaDarah"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Gula Darah"
                  dot={{ fill: '#3b82f6', r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="kolesterol"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Kolesterol"
                  dot={{ fill: '#10b981', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        )}

        {/* Table Section */}
        <Card title="Data Pemeriksaan" subtitle={`Total: ${pemeriksaanList.length} pemeriksaan`}>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : pemeriksaanList.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">
                Belum Ada Data
              </h3>
              <p className="text-neutral-600">
                Pilih filter dan klik &quot;Generate Laporan&quot; untuk melihat data
              </p>
            </div>
          ) : (
            <Table
              columns={columns as unknown as Column<Record<string, unknown>>[]}
              data={pemeriksaanList as unknown as Record<string, unknown>[]}
              isLoading={false}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
