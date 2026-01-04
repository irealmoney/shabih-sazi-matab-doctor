'use client';

import { useClinicSimulation } from '@/hooks/useClinicSimulation';
import ClinicHeader from '@/components/ClinicHeader';
import EntranceArea from '@/components/EntranceArea';
import ReceptionArea from '@/components/ReceptionArea';
import PaymentArea from '@/components/PaymentArea';
import WaitingArea from '@/components/WaitingArea';
import DoctorOffice from '@/components/DoctorOffice';
import ControlPanel from '@/components/ControlPanel';

export default function Home() {
  const {
    entrancePatients,
    waitingPatients,
    receptionPatients,
    paymentPatients,
    doctorPatients,
    receptionDoneQueue,
    receptionBooths,
    doctors,
    isRunning,
    simulationSpeed,
    clinicTime,
    stats,
    addPatient,
    updateReceptionCount,
    updateDoctorCount,
    toggleSimulation,
    setSimulationSpeed
  } = useClinicSimulation();

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* بخش اصلی */}
          <div className="lg:col-span-3">
            <ClinicHeader
              clinicTime={clinicTime}
              entranceCount={entrancePatients.length}
              activeDoctors={doctors.length}
            />
            
            {/* چیدمان بخش‌های مطب */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <EntranceArea patients={entrancePatients} />
              <ReceptionArea booths={receptionBooths} />
              <PaymentArea 
                paymentPatients={paymentPatients}
                receptionDoneQueue={receptionDoneQueue}
              />
              <WaitingArea patients={waitingPatients} />
              <DoctorOffice doctors={doctors} />
            </div>
          </div>

          {/* پنل کنترل */}
          <div className="lg:col-span-1">
            <ControlPanel
              receptionCount={receptionBooths.length}
              doctorCount={doctors.length}
              isRunning={isRunning}
              simulationSpeed={simulationSpeed}
              stats={stats}
              onAddPatient={addPatient}
              onToggleSimulation={toggleSimulation}
              onUpdateReception={updateReceptionCount}
              onUpdateDoctors={updateDoctorCount}
              onSpeedChange={setSimulationSpeed}
            />
          </div>
        </div>
      </div>
    </main>
  );
}

