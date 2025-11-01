/**
 * Admin Dashboard Page
 * Displays statistics, charts, and recent pemeriksaan
 * Fetches data from laporan API
 */

'use client';

import { useEffect, useState } from 'react';
import { Users, UserCheck, Activity, UserCog } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StatCard } from '@/components/features/dashboard';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { getDashboardStats } from '@/lib/api/laporan';
import { useToast } from '@/lib/hooks';
import { DashboardStats } from '@/types';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await getDashboardStats();
      
      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      showToast('error', 'Gagal memuat data dashboard');
      console.error('Dashboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Stat cards configuration
  const statCards = stats
    ? [
        {
          label: 'Total Lansia',
          value: stats.totalLansia,
          icon: UserCheck,
          iconColor: 'text-blue-600',
          iconBgColor: 'bg-blue-100',
        },
        {
          label: 'Total Petugas',
          value: stats.totalPetugas,
          icon: Users,
          iconColor: 'text-green-600',
          iconBgColor: 'bg-green-100',
        },
        {
          label: 'Pemeriksaan Bulan Ini',
          value: stats.pemeriksaanBulanIni,
          icon: Activity,
          iconColor: 'text-purple-600',
          iconBgColor: 'bg-purple-100',
        },
        {
          label: 'Petugas Aktif',
          value: stats.petugasAktif,
          icon: UserCog,
          iconColor: 'text-orange-600',
          iconBgColor: 'bg-orange-100',
        },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard Admin</h1>
        <p className="text-neutral-600 mt-1">
          Ringkasan statistik dan aktivitas sistem
        </p>
      </div>

      {/* Stat Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <StatCard key={index} {...card} />
          ))}
        </div>
      )}

      {/* Chart Section */}
      <Card title="Aktivitas Pemeriksaan" subtitle="6 bulan terakhir">
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : stats?.pemeriksaanPerBulan && stats.pemeriksaanPerBulan.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.pemeriksaanPerBulan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis
                dataKey="bulan"
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
              <Line
                type="monotone"
                dataKey="jumlah"
                stroke="#262626"
                strokeWidth={2}
                dot={{ fill: '#262626', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-64 flex items-center justify-center text-neutral-500">
            <p>Tidak ada data pemeriksaan</p>
          </div>
        )}
      </Card>

      {/* Recent Pemeriksaan Table - Placeholder for now */}
      <Card title="Pemeriksaan Terbaru" subtitle="10 pemeriksaan terakhir">
        <div className="text-center py-8 text-neutral-500">
          <p>Fitur riwayat pemeriksaan akan ditambahkan pada task berikutnya</p>
        </div>
      </Card>
    </div>
  );
}
