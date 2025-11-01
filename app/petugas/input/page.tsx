/**
 * Petugas Input Pemeriksaan Page
 * Form for inputting health examination results for lansia
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { getLansiaById } from '@/lib/api/lansia';
import { createPemeriksaan } from '@/lib/api/pemeriksaan';
import { useToast } from '@/lib/hooks';
import { validateRequired, validatePositiveNumber } from '@/lib/utils';
import { Lansia, CreatePemeriksaanRequest } from '@/types';
import { User, Calendar, MapPin, ClipboardEdit } from 'lucide-react';

export default function InputPemeriksaanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lansiaId = searchParams.get('lansiaId');
  
  const [lansia, setLansia] = useState<Lansia | null>(null);
  const [isLoadingLansia, setIsLoadingLansia] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [tekananDarah, setTekananDarah] = useState('');
  const [beratBadan, setBeratBadan] = useState('');
  const [gulaDarah, setGulaDarah] = useState('');
  const [kolesterol, setKolesterol] = useState('');
  const [keluhan, setKeluhan] = useState('');
  
  // Error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { showToast } = useToast();

  useEffect(() => {
    if (lansiaId) {
      fetchLansiaData(lansiaId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lansiaId]);

  const fetchLansiaData = async (id: string) => {
    setIsLoadingLansia(true);
    try {
      const response = await getLansiaById(id);
      
      if (response.error) {
        showToast('error', response.error);
        return;
      }

      if (response.data) {
        setLansia(response.data);
      }
    } catch (error) {
      showToast('error', 'Gagal memuat data lansia');
      console.error('Fetch lansia error:', error);
    } finally {
      setIsLoadingLansia(false);
    }
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!lansiaId) {
      showToast('error', 'ID Lansia tidak ditemukan. Silakan scan QR Code terlebih dahulu.');
      return false;
    }

    // Validate tekanan darah
    const tekananDarahResult = validateRequired(tekananDarah, 'Tekanan darah');
    if (!tekananDarahResult.isValid) {
      newErrors.tekanan_darah = tekananDarahResult.error!;
    }

    // Validate berat badan
    const beratBadanResult = validatePositiveNumber(beratBadan, 'Berat badan');
    if (!beratBadanResult.isValid) {
      newErrors.berat_badan = beratBadanResult.error!;
    }

    // Validate gula darah
    const gulaDarahResult = validateRequired(gulaDarah, 'Gula darah');
    if (!gulaDarahResult.isValid) {
      newErrors.gula_darah = gulaDarahResult.error!;
    }

    // Validate kolesterol
    const kolesterolResult = validateRequired(kolesterol, 'Kolesterol');
    if (!kolesterolResult.isValid) {
      newErrors.kolesterol = kolesterolResult.error!;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const data: CreatePemeriksaanRequest = {
        lansiaId: lansiaId!,
        tekanan_darah: tekananDarah.trim(),
        berat_badan: beratBadan.trim(),
        gula_darah: gulaDarah.trim(),
        kolesterol: kolesterol.trim(),
        keluhan: keluhan.trim(),
      };

      const response = await createPemeriksaan(data);

      if (response.error) {
        showToast('error', response.error);
        return;
      }

      showToast('success', 'Data pemeriksaan berhasil disimpan');
      
      // Reset form
      setTekananDarah('');
      setBeratBadan('');
      setGulaDarah('');
      setKolesterol('');
      setKeluhan('');
      setErrors({});
      
      // Redirect to dashboard after short delay
      setTimeout(() => {
        router.push('/petugas/dashboard');
      }, 1500);
    } catch (error) {
      showToast('error', 'Gagal menyimpan data pemeriksaan');
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Input Pemeriksaan</h1>
        <p className="text-neutral-600 mt-1">
          Masukkan hasil pemeriksaan kesehatan lansia
        </p>
      </div>

      {/* Lansia Info Card */}
      {lansiaId && (
        <Card>
          {isLoadingLansia ? (
            <div className="space-y-3">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-56" />
            </div>
          ) : lansia ? (
            <div>
              <h3 className="font-semibold text-neutral-900 mb-4">Data Lansia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-600">Nama Lengkap</p>
                    <p className="font-medium text-neutral-900">{lansia.nama}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                  <div>
                    <p className="text-sm text-neutral-600">NIK</p>
                    <p className="font-mono text-neutral-900">{lansia.nik}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-600">Umur</p>
                    <p className="text-neutral-900">
                      {calculateAge(lansia.tanggal_lahir)} tahun
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neutral-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-600">Alamat</p>
                    <p className="text-neutral-900 text-sm">{lansia.alamat}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </Card>
      )}

      {/* Form Card */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardEdit className="w-5 h-5 text-neutral-600" />
            <h3 className="font-semibold text-neutral-900">Data Pemeriksaan</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Tekanan Darah"
              type="text"
              value={tekananDarah}
              onChange={setTekananDarah}
              error={errors.tekanan_darah}
              required
              placeholder="Contoh: 120/80"
            />

            <Input
              label="Berat Badan"
              type="number"
              value={beratBadan}
              onChange={setBeratBadan}
              error={errors.berat_badan}
              required
              placeholder="Dalam kg"
            />

            <Input
              label="Gula Darah"
              type="text"
              value={gulaDarah}
              onChange={setGulaDarah}
              error={errors.gula_darah}
              required
              placeholder="Contoh: 120"
            />

            <Input
              label="Kolesterol"
              type="text"
              value={kolesterol}
              onChange={setKolesterol}
              error={errors.kolesterol}
              required
              placeholder="Contoh: 200"
            />
          </div>

          <Input
            label="Keluhan"
            type="textarea"
            value={keluhan}
            onChange={setKeluhan}
            placeholder="Masukkan keluhan atau catatan tambahan (opsional)"
            rows={4}
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              <ClipboardEdit className="w-4 h-4 mr-2" />
              Simpan Pemeriksaan
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Card */}
      {!lansiaId && (
        <Card>
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">
              Lansia Belum Dipilih
            </h3>
            <p className="text-neutral-600 mb-4">
              Silakan scan QR Code lansia terlebih dahulu untuk melanjutkan input pemeriksaan
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/petugas/scan')}
            >
              Scan QR Code
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
