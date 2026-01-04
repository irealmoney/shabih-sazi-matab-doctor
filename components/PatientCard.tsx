'use client';

import type { Patient } from '@/types/patient';

interface PatientCardProps {
  patient: Patient;
}

const statusConfig = {
  entrance: { bg: 'bg-yellow-50', border: 'border-yellow-300', text: 'در انتظار پذیرش' },
  reception: { bg: 'bg-amber-50', border: 'border-amber-300', text: 'در حال پذیرش' },
  payment: { bg: 'bg-teal-50', border: 'border-teal-300', text: 'در حال پرداخت' },
  waiting: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'در انتظار' },
  doctor: { bg: 'bg-green-50', border: 'border-green-300', text: 'در حال ویزیت' },
  done: { bg: 'bg-gray-50', border: 'border-gray-300', text: 'تمام شده' }
};

export default function PatientCard({ patient }: PatientCardProps) {
  const config = statusConfig[patient.status];

  return (
    <div 
      className={`${config.bg} ${config.border} border-2 rounded-lg p-3 mb-2 transition-all duration-300 shadow-sm`}
      id={`patient-${patient.id}`}
    >
      <div className="font-medium text-gray-800">{patient.name}</div>
      <div className="text-xs text-gray-600 mt-1">{config.text}</div>
    </div>
  );
}

