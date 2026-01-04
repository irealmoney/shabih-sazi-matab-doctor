// انواع داده‌های مربوط به بیمار
export interface Patient {
  id: number;
  name: string;
  startTime: Date;
  waitTime: number;
  visitTime: number;
  status: PatientStatus;
  receptionBooth: number | null;
  doctor: number | null;
  hasPaid: boolean;
  receptionOrder: number | null;
  _paying?: boolean;
}

// وضعیت‌های مختلف بیمار
export type PatientStatus = 
  | 'entrance' 
  | 'reception' 
  | 'payment' 
  | 'waiting' 
  | 'doctor' 
  | 'done';

// باجه پذیرش
export interface ReceptionBooth {
  id: number;
  busy: boolean;
  patient: Patient | null;
}

// دکتر
export interface Doctor {
  id: number;
  busy: boolean;
  patient: Patient | null;
}

// آمار شبیه‌سازی
export interface SimulationStats {
  avgWaitTime: number;
  totalVisits: number;
  waitTimes: number[];
  visitTimes: number[];
}

