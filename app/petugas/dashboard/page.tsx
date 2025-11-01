/**
 * Petugas Dashboard Page
 * Displays statistics, shortcuts, and recent pemeriksaan for logged-in petugas
 */

'use client';

import { useEffect, useState, useMemo } from 'react';
import { UserCheck, Activity, Calendar, Scan, History } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/features/dashboard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getAllLansia } from '@/lib/api/lansia';
import { getAllPemeriksaan } from '@/lib/api/pemeriksaan';
import { useAuth, useToast } from '@/lib/hooks';
import { Pemeriksaan } from '@/types';

export default function PetugasDashboardPage() {
  const [totalLansia, setTotalLansia] = useState(0);
  const [pemeriksaanHariIni, setPemeriksaanHariIni] = useState(0);
  const [pemeriksaanBulanIni, setPemeriksaanBulanIni] = useState(0);
  const [recentPemeriksaan, setRecentPemeriksaan] = useState<Pemeriksaan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Fetch total lansia
      const lansiaResponse = await getAllLansia(1, 1000);
      if (lansiaResponse.data) {
        setTotalLansia(lansiaResponse.data.pagination.total);
      }

      // Fetch all pemeriksaan (we'll filter client-side for now)
      const pemeriksaanResponse = await getAllPemeriksaan(undefined, 1, 1000);
      
      if (pemeriksaanResponse.data) {
        const allPemeriksaan = pemeriksaanResponse.data.data;
        
        // Filter by current user
        const myPemeriksaan = allPemeriksaan.filter(
          (p) => p.createdBy === user.id
        );

        // Calculate today's pemeriksaan
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayPemeriksaan = myPemeriksaan.filter((p) => {
          const pemeriksaanDate = new Date(p.tanggal);
          pemeriksaanDate.setHours(0, 0, 0, 0);
          return pemeriksaanDate.getTime() === today.getTime();
        });
        setPemeriksaanHariIni(todayPemeriksaan.length);

        // Calculate this month's pemeriksaan
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const thisMonthPemeriksaan = myPemeriksaan.filter((p) => {
          const pemeriksaanDate = new Date(p.tanggal);
          return (
            pemeriksaanDate.getMonth() === currentMonth &&
            pemeriksaanDate.getFullYear() === currentYear
          );
        });
        setPemeriksaanBulanIni(thisMonthPemeriksaan.length);

        // Get 5 most recent pemeriksaan
        const sortedPemeriksaan = [...myPemeriksaan].sort(
          (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        );
        setRecentPemeriksaan(sortedPemeriksaan.slice(0, 5));
      }
    } catch (error) {
      showToast('error', 'Gagal memuat data dashboard');
      console.error('Dashboard fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize stat cards configuration to prevent unnecessary recalculations
  const statCards = useMemo(
    () => [
      {
        label: 'Total Lansia Terdaftar',
        value: totalLansia,
        icon: UserCheck,
        iconColor: 'text-blue-600',
        iconBgColor: 'bg-blue-100',
      },
      {
        label: 'Pemeriksaan Hari Ini',
        value: pemeriksaanHariIni,
        icon: Activity,
        iconColor: 'text-green-600',
        iconBgColor: 'bg-green-100',
      },
      {
        label: 'Pemeriksaan Bulan Ini',
        value: pemeriksaanBulanIni,
        icon: Calendar,
        iconColor: 'text-purple-600',
        iconBgColor: 'bg-purple-100',
      },
    ],
    [totalLansia, pemeriksaanHariIni, pemeriksaanBulanIni]
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard Petugas</h1>
        <p className="text-neutral-600 mt-1">
          Selamat datang, {user?.nama || 'Petugas'}
        </p>
      </header>

      {/* Stat Cards Grid */}
      <section aria-label="Statistik">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statCards.map((card, index) => (
              <StatCard key={index} {...card} />
            ))}
          </div>
        )}
      </section>

      {/* Shortcut Buttons */}
      <section aria-label="Aksi Cepat">
        <Card>
        <h3 className="font-semibold text-neutral-900 mb-4">Aksi Cepat</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/petugas/scan" className="block">
            <Button
              variant="primary"
              className="w-full h-auto py-4 flex-col gap-2"
            >
              <Scan className="w-8 h-8" />
              <span className="text-base font-semibold">Scan QR Code</span>
              <span className="text-xs opacity-90">
                Pindai QR Code lansia untuk pemeriksaan
              </span>
            </Button>
          </Link>
          <Link href="/petugas/riwayat" className="block">
            <Button
              variant="secondary"
              className="w-full h-auto py-4 flex-col gap-2"
            >
              <History className="w-8 h-8" />
              <span className="text-base font-semibold">Lihat Riwayat</span>
              <span className="text-xs opacity-90">
                Lihat riwayat pemeriksaan lansia
              </span>
            </Button>
          </Link>
        </div>
        </Card>
      </section>

      {/* Recent Pemeriksaan */}
      <section aria-label="Pemeriksaan Terbaru">
        <Card title="Pemeriksaan Terbaru" subtitle="5 pemeriksaan terakhir Anda">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : recentPemeriksaan.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Belum Ada Pemeriksaan
            </h3>
            <p className="text-neutral-600 mb-4">
              Anda belum melakukan pemeriksaan. Mulai dengan scan QR Code lansia.
            </p>
            <Link href="/petugas/scan">
              <Button variant="primary">
                <Scan className="w-4 h-4 mr-2" />
                Scan QR Code
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPemeriksaan.map((pemeriksaan) => (
              <div
                key={pemeriksaan.id}
                className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">
                    {pemeriksaan.lansia?.nama || 'Lansia'}
                  </p>
                  <p className="text-sm text-neutral-600">
                    NIK: {pemeriksaan.lansia?.nik || '-'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-neutral-900">
                    {new Date(pemeriksaan.tanggal).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs text-neutral-600">
                    {pemeriksaan.tekanan_darah} mmHg
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        </Card>
      </section>
    </div>
  );
}
