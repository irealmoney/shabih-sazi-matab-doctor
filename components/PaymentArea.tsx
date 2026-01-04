'use client';

import { CreditCard } from 'lucide-react';
import type { Patient } from '@/types/patient';
import PatientCard from './PatientCard';

interface PaymentAreaProps {
  paymentPatients: Patient[];
  receptionDoneQueue: Patient[];
}

export default function PaymentArea({ 
  paymentPatients, 
  receptionDoneQueue 
}: PaymentAreaProps) {
  const allPatients = [...paymentPatients, ...receptionDoneQueue].sort(
    (a, b) => (a.receptionOrder || 0) - (b.receptionOrder || 0)
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md min-h-[200px]">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-blue-500" />
        صندوق
      </h3>
      <div className="bg-gray-50 p-2 rounded mb-3">
        <div className="text-sm text-gray-700">هزینه ویزیت: 150,000 تومان</div>
      </div>
      <div className="max-h-[300px] overflow-y-auto pr-2">
        {allPatients.map(patient => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
    </div>
  );
}

