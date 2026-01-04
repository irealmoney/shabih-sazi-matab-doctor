'use client';

import { Sofa } from 'lucide-react';
import type { Patient } from '@/types/patient';
import PatientCard from './PatientCard';

interface WaitingAreaProps {
  patients: Patient[];
}

export default function WaitingArea({ patients }: WaitingAreaProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-h-[200px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Sofa className="w-5 h-5 text-blue-500" />
        سالن انتظار
      </h3>
      <div className="max-h-[300px] overflow-y-auto pr-2">
        {patients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

