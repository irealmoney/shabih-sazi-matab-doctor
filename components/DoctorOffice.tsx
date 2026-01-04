'use client';

import { Stethoscope } from 'lucide-react';
import type { Doctor, Patient } from '@/types/patient';
import PatientCard from './PatientCard';

interface DoctorOfficeProps {
  doctors: Doctor[];
}

export default function DoctorOffice({ doctors }: DoctorOfficeProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-h-[200px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Stethoscope className="w-5 h-5 text-blue-500" />
        اتاق دکتر
      </h3>
      <div className="grid grid-cols-1 gap-3">
        {doctors.map(doctor => (
          <div
            key={doctor.id}
            className={`bg-gray-50 p-3 rounded ${
              doctor.busy ? 'border-r-4 border-red-500' : ''
            }`}
          >
            <h4 className="text-base font-medium text-gray-800 mb-2 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-gray-600" />
              دکتر {doctor.id}
              {doctor.busy && (
                <span className="bg-yellow-200 text-gray-800 px-2 py-1 rounded text-xs mr-2">
                  مشغول ویزیت
                </span>
              )}
            </h4>
            {doctor.patient && (
              <PatientCard patient={doctor.patient} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

