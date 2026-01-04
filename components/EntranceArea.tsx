'use client';

import { DoorOpen } from 'lucide-react';
import type { Patient } from '@/types/patient';
import PatientCard from './PatientCard';

interface EntranceAreaProps {
  patients: Patient[];
}

export default function EntranceArea({ patients }: EntranceAreaProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-h-[200px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <DoorOpen className="w-5 h-5 text-blue-500" />
        ورودی مطب
      </h3>
      <div className="bg-gray-50 p-2 rounded mb-3">
        <div className="inline-block px-3 py-1 bg-yellow-200 text-gray-800 rounded text-sm">
          در انتظار پذیرش
        </div>
      </div>
      <div className="max-h-[300px] overflow-y-auto pr-2">
        {patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

