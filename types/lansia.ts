/**
 * Lansia (elderly) related type definitions
 */

import { ID, DateString } from './common';
import { Pemeriksaan } from './pemeriksaan';

/**
 * Lansia entity from database
 */
export interface Lansia {
  id: ID;
  nama: string;
  nik: string;
  tanggal_lahir: DateString;
  alamat: string;
  penyakit_bawaan: string;
  kontak_keluarga: string;
  qr_code_url: string | null;
  createdAt: DateString;
  updatedAt: DateString;
}

/**
 * Create lansia request payload
 */
export interface CreateLansiaRequest {
  nama: string;
  nik: string;
  tanggal_lahir: string;
  alamat: string;
  penyakit_bawaan: string;
  kontak_keluarga: string;
}

/**
 * Update lansia request payload (all fields optional)
 */
export interface UpdateLansiaRequest {
  nama?: string;
  nik?: string;
  tanggal_lahir?: string;
  alamat?: string;
  penyakit_bawaan?: string;
  kontak_keluarga?: string;
}

/**
 * Lansia with related pemeriksaan records
 */
export interface LansiaWithPemeriksaan extends Lansia {
  pemeriksaan: Pemeriksaan[];
}
