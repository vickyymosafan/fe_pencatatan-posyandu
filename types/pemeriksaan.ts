/**
 * Pemeriksaan (health examination) related type definitions
 */

import { ID, DateString } from './common';
import { Lansia } from './lansia';
import { User } from './user';

/**
 * Pemeriksaan entity from database
 */
export interface Pemeriksaan {
  id: ID;
  lansiaId: ID;
  tanggal: DateString;
  tekanan_darah: string;
  berat_badan: string;
  gula_darah: string;
  kolesterol: string;
  keluhan: string;
  createdBy: ID;
  createdAt: DateString;
  updatedAt: DateString;
  lansia?: Lansia;
  user?: User;
}

/**
 * Create pemeriksaan request payload
 */
export interface CreatePemeriksaanRequest {
  lansiaId: ID;
  tekanan_darah: string;
  berat_badan: string;
  gula_darah: string;
  kolesterol: string;
  keluhan: string;
}

/**
 * Pemeriksaan with populated relations
 */
export interface PemeriksaanWithRelations extends Pemeriksaan {
  lansia: Lansia;
  user: User;
}
