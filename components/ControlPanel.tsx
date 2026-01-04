'use client';

import { useState } from 'react';
import { Settings, Play, Pause, UserPlus, BarChart3 } from 'lucide-react';
import StatsChart from './StatsChart';

interface ControlPanelProps {
  receptionCount: number;
  doctorCount: number;
  isRunning: boolean;
  simulationSpeed: number;
  stats: {
    avgWaitTime: number;
    totalVisits: number;
    waitTimes: number[];
    visitTimes: number[];
  };
  onAddPatient: () => void;
  onToggleSimulation: () => void;
  onUpdateReception: (count: number) => void;
  onUpdateDoctors: (count: number) => void;
  onSpeedChange: (speed: number) => void;
}

export default function ControlPanel({
  receptionCount,
  doctorCount,
  isRunning,
  simulationSpeed,
  stats,
  onAddPatient,
  onToggleSimulation,
  onUpdateReception,
  onUpdateDoctors,
  onSpeedChange
}: ControlPanelProps) {
  const [localReceptionCount, setLocalReceptionCount] = useState(receptionCount);
  const [localDoctorCount, setLocalDoctorCount] = useState(doctorCount);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
        <Settings className="w-5 h-5 text-blue-500" />
        کنترل شبیه‌سازی
      </h3>

      <div className="space-y-3 mb-4">
        {/* تنظیمات باجه‌های پذیرش */}
        <div className="bg-gray-50 p-3 rounded mb-3">
          <label className="block mb-2 text-sm text-gray-700">
            تعداد باجه‌های پذیرش:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="5"
              value={localReceptionCount}
              onChange={(e) => setLocalReceptionCount(Number(e.target.value))}
              className="w-20 text-center border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => onUpdateReception(localReceptionCount)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* تنظیمات دکترها */}
        <div className="bg-gray-50 p-3 rounded mb-3">
          <label className="block mb-2 text-sm text-gray-700">
            تعداد دکتر:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="3"
              value={localDoctorCount}
              onChange={(e) => setLocalDoctorCount(Number(e.target.value))}
              className="w-20 text-center border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={() => onUpdateDoctors(localDoctorCount)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* دکمه افزودن بیمار */}
        <button
          onClick={onAddPatient}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <UserPlus className="w-4 h-4" />
          افزودن بیمار جدید
        </button>

        {/* دکمه شروع/توقف */}
        <button
          onClick={onToggleSimulation}
          className={`w-full py-2 rounded transition flex items-center justify-center gap-2 ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4" />
              توقف شبیه‌سازی
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              شروع شبیه‌سازی
            </>
          )}
        </button>

        {/* کنترل سرعت */}
        <div className="mt-4">
          <label className="block mb-2 text-sm text-gray-700">
            سرعت شبیه‌سازی: {simulationSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={simulationSpeed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* پنل آمار */}
      <div className="mt-6">
        <h4 className="text-base font-semibold mb-3 text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-blue-500" />
          آمار و اطلاعات
        </h4>
        <div className="bg-gray-50 p-4 rounded mb-3">
          <StatsChart stats={stats} />
        </div>
        <div className="bg-gray-50 p-4 rounded space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">میانگین زمان انتظار:</span>
            <span className="font-semibold text-gray-800">
              {Math.round(stats.avgWaitTime)} دقیقه
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">تعداد ویزیت‌های امروز:</span>
            <span className="font-semibold text-gray-800">{stats.totalVisits}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

