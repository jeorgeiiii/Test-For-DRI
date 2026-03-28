// Auto-synced from lib/data/shine_villages.dart
import shineData from './shine_villages.json';

export interface ShineVillage {
  shineCode: string;
  panchayat: string;
  panchayatLgdCode: string;
  revenueVillage: string;
  rvLgdCode: string;
  tehsil: string;
  block: string;
  district: string;
  state: string;
  praTeam: string;
  emailCount?: number | null;
  email1?: string | null;
  email2?: string | null;
}

export const shineVillages: ShineVillage[] = shineData;