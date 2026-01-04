'use client';

import { UserCircle } from 'lucide-react';
import type { ReceptionBooth, Patient } from '@/types/patient';
import PatientCard from './PatientCard';

interface ReceptionAreaProps {
  booths: ReceptionBooth[];
}

export default function ReceptionArea({ booths }: ReceptionAreaProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-h-[200px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <UserCircle className="w-5 h-5 text-blue-500" />
        پذیرش
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
        {booths.map(booth => (
          <div
            key={booth.id}
            className={`bg-gray-50 p-3 rounded ${
              booth.busy ? 'border-r-4 border-green-500' : ''
            }`}
          >
            <h4 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
              <UserCircle className="w-4 h-4 text-gray-600" />
              باجه {booth.id}
            </h4>
            {booth.patient && (
              <PatientCard patient={booth.patient} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

