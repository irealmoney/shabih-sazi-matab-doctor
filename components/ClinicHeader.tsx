'use client';

import { Clock, Users, UserCheck } from 'lucide-react';

interface ClinicHeaderProps {
  clinicTime: Date;
  entranceCount: number;
  activeDoctors: number;
}

export default function ClinicHeader({ 
  clinicTime, 
  entranceCount, 
  activeDoctors 
}: ClinicHeaderProps) {
  const timeString = clinicTime.toLocaleTimeString('fa-IR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
        شبیه‌سازی مطب پزشک
      </h1>
      <div className="flex justify-around items-center mt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-500" />
          <span className="text-gray-700">{timeString}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-500" />
          <span className="text-gray-700">
            بیماران در انتظار: <span className="font-semibold">{entranceCount}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-blue-500" />
          <span className="text-gray-700">
            دکترهای فعال: <span className="font-semibold">{activeDoctors}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

