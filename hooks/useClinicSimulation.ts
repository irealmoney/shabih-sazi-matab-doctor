'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Patient, ReceptionBooth, Doctor, PatientStatus } from '@/types/patient';

// کلاس بیمار
class PatientClass implements Patient {
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

  constructor(id: number) {
    this.id = id;
    this.name = `بیمار ${id}`;
    this.startTime = new Date();
    this.waitTime = 0;
    this.visitTime = 0;
    this.status = 'entrance';
    this.receptionBooth = null;
    this.doctor = null;
    this.hasPaid = false;
    this.receptionOrder = null;
  }
}

// هوک اصلی شبیه‌سازی
export function useClinicSimulation() {
  const [entrancePatients, setEntrancePatients] = useState<Patient[]>([]);
  const [waitingPatients, setWaitingPatients] = useState<Patient[]>([]);
  const [receptionPatients, setReceptionPatients] = useState<Patient[]>([]);
  const [paymentPatients, setPaymentPatients] = useState<Patient[]>([]);
  const [doctorPatients, setDoctorPatients] = useState<Patient[]>([]);
  const [completedPatients, setCompletedPatients] = useState<Patient[]>([]);
  const [receptionDoneQueue, setReceptionDoneQueue] = useState<Patient[]>([]);
  
  const [receptionBooths, setReceptionBooths] = useState<ReceptionBooth[]>([
    { id: 1, busy: false, patient: null }
  ]);
  const [doctors, setDoctors] = useState<Doctor[]>([
    { id: 1, busy: false, patient: null }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [clinicTime, setClinicTime] = useState(() => {
    const time = new Date();
    time.setHours(8, 0, 0, 0);
    return time;
  });
  
  const [stats, setStats] = useState({
    avgWaitTime: 0,
    totalVisits: 0,
    waitTimes: [] as number[],
    visitTimes: [] as number[]
  });
  
  const patientCounterRef = useRef(1);
  const receptionOrderCounterRef = useRef(1);
  const maxTotalPatients = 40;
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const clockIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeTimeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const processingPaymentRef = useRef<Set<number>>(new Set()); // برای جلوگیری از پردازش همزمان یک بیمار
  const addingPatientRef = useRef(false); // lock برای جلوگیری از افزودن همزمان

  // افزودن بیمار جدید
  const addPatient = useCallback(() => {
    // جلوگیری از افزودن همزمان
    if (addingPatientRef.current) return;
    addingPatientRef.current = true;

    // بررسی ظرفیت با استفاده از state فعلی
    const totalCurrent = 
      entrancePatients.length +
      waitingPatients.length +
      receptionPatients.length +
      doctorPatients.length;

    if (totalCurrent >= maxTotalPatients) {
      addingPatientRef.current = false;
      alert('ظرفیت مطب تکمیل است!');
      return;
    }

    // افزایش شمارنده و ایجاد بیمار - اتمیک
    const patientId = patientCounterRef.current;
    patientCounterRef.current += 1;
    const patient = new PatientClass(patientId);
    
    setEntrancePatients(prev => {
      addingPatientRef.current = false;
      return [...prev, patient];
    });
  }, [entrancePatients.length, waitingPatients.length, receptionPatients.length, doctorPatients.length]);

  // بروزرسانی تعداد باجه‌های پذیرش
  const updateReceptionCount = useCallback((count: number) => {
    if (count < 1 || count > 5) return;
    setReceptionBooths(prev => {
      const busyBooths = prev.filter(booth => booth.busy);
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        busy: busyBooths.find(b => b.id === i + 1)?.busy || false,
        patient: busyBooths.find(b => b.id === i + 1)?.patient || null
      }));
    });
  }, []);

  // بروزرسانی تعداد دکترها
  const updateDoctorCount = useCallback((count: number) => {
    if (count < 1 || count > 3) return;
    setDoctors(prev => {
      const busyDoctors = prev.filter(doc => doc.busy);
      return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        busy: busyDoctors.find(d => d.id === i + 1)?.busy || false,
        patient: busyDoctors.find(d => d.id === i + 1)?.patient || null
      }));
    });
  }, []);

  // پردازش صف پذیرش
  const processReceptionQueue = useCallback(() => {
    setEntrancePatients(prevEntrance => {
      if (prevEntrance.length === 0) return prevEntrance;
      
      setReceptionBooths(prevBooths => {
        const newBooths = [...prevBooths];
        const newEntrance = [...prevEntrance];
        const patientsToAdd: Patient[] = [];

        for (let i = 0; i < newBooths.length; i++) {
          const booth = newBooths[i];
          if (!booth.busy && newEntrance.length > 0) {
            const patient = newEntrance.shift()!;
            const receptionOrder = receptionOrderCounterRef.current;
            receptionOrderCounterRef.current += 1;
            
            const updatedPatient: Patient = {
              ...patient,
              status: 'reception',
              receptionOrder: receptionOrder,
              receptionBooth: booth.id
            };
            
            newBooths[i] = {
              ...booth,
              busy: true,
              patient: updatedPatient
            };
            patientsToAdd.push(updatedPatient);

            const receptionTime = (1000 + Math.random() * 1000) / simulationSpeed;
            const timeout = setTimeout(() => {
              activeTimeoutsRef.current.delete(timeout);
              setReceptionBooths(prev => prev.map(b => 
                b.id === booth.id ? { ...b, busy: false, patient: null } : b
              ));
              setReceptionPatients(prev => prev.filter(p => p.id !== updatedPatient.id));
              setReceptionDoneQueue(prev => {
                // بررسی تکراری نبودن
                if (prev.some(p => p.id === updatedPatient.id)) {
                  console.debug('[sim] skip adding receptionDone dup', updatedPatient.id, 'currentIds', prev.map(p => p.id));
                  return prev;
                }
                const updated: Patient = { ...updatedPatient, status: 'payment' };
                const newQueue = [...prev, updated];
                console.debug('[sim] added to receptionDoneQueue', updated.id, 'newQueueIds', newQueue.map(p => p.id));
                return newQueue;
              });
            }, receptionTime);
            activeTimeoutsRef.current.add(timeout);
          }
        }

        if (patientsToAdd.length > 0) {
          setReceptionPatients(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPatients = patientsToAdd.filter(p => !existingIds.has(p.id));
            return [...prev, ...newPatients];
          });
          setEntrancePatients(newEntrance);
          return newBooths;
        }
        
        return prevBooths;
      });
      
      return prevEntrance;
    });
  }, [simulationSpeed]);

  // پردازش پرداخت - اصلاح شده برای جلوگیری از race و حذف غیرمطمئن
  const processPaymentQueue = useCallback(() => {
    // اگر در حال پردازش بیمار دیگری در payment هستیم، صبر می‌کنیم
    setReceptionDoneQueue(prevQueue => {
      if (prevQueue.length === 0) return prevQueue;

      const sorted = [...prevQueue].sort((a, b) => (a.receptionOrder || 0) - (b.receptionOrder || 0));
      const next = sorted[0];

      // اگر این بیمار قبلاً در حال پردازش است، نادیده می‌گیریم
      if (processingPaymentRef.current.has(next.id)) {
        return prevQueue;
      }

      // علامت‌گذاری بیمار به عنوان در حال پردازش
      processingPaymentRef.current.add(next.id);
      const payingPatient: Patient = { ...next, _paying: true };

      // قرار دادن بیمار در paymentPatients بلافاصله (بدون setTimeout 0)
      setPaymentPatients(() => [payingPatient]);
      console.debug('[sim] start payment', payingPatient.id, 'paymentPatients', [payingPatient.id]);

      // زمان پرداخت
      const paymentTime = (1000 + Math.random() * 1000) / simulationSpeed;
      const timeout = setTimeout(() => {
        activeTimeoutsRef.current.delete(timeout);
        processingPaymentRef.current.delete(payingPatient.id);

        // حذف از paymentPatients (حذف بر اساس id به جای فرض به‌عنوان index 0)
        setPaymentPatients(prev => {
          const after = prev.filter(p => p.id !== payingPatient.id);
          console.debug('[sim] removed from paymentPatients', payingPatient.id, 'beforeIds', prev.map(p => p.id), 'afterIds', after.map(p => p.id));
          return after;
        });

        // اضافه کردن به waitingPatients، بدون ویژگی موقتی _paying
        const { _paying, ...rest } = payingPatient as any;
        const updated: Patient = { ...rest, hasPaid: true, status: 'waiting' } as Patient;

        setWaitingPatients(prevWaiting => {
          if (prevWaiting.some(p => p.id === updated.id)) {
            console.debug('[sim] skip adding waiting dup', updated.id, 'waitingIds', prevWaiting.map(p => p.id));
            return prevWaiting;
          }
          const newWaiting = [...prevWaiting, updated];
          console.debug('[sim] added to waitingPatients', updated.id, 'waitingIds', newWaiting.map(p => p.id));
          return newWaiting;
        });
      }, paymentTime);

      activeTimeoutsRef.current.add(timeout);

      // حذف از receptionDoneQueue
      return prevQueue.filter(p => p.id !== next.id);
    });
  }, [simulationSpeed]);

  // پردازش صف دکتر
  const processDoctorQueue = useCallback(() => {
    setWaitingPatients(prevWaiting => {
      if (prevWaiting.length === 0) return prevWaiting;
      
      setDoctors(prevDoctors => {
        const newDoctors = [...prevDoctors];
        const newWaiting = [...prevWaiting];
        const patientsToAdd: Patient[] = [];

        for (let i = 0; i < newDoctors.length; i++) {
          const doctor = newDoctors[i];
          if (!doctor.busy && newWaiting.length > 0) {
            const next = newWaiting[0];
            if (next.hasPaid) {
              newWaiting.shift();
              const updatedPatient: Patient = { ...next, status: 'doctor' };
              
              newDoctors[i] = {
                ...doctor,
                busy: true,
                patient: updatedPatient
              };
              patientsToAdd.push(updatedPatient);

              const visitTime = (8000 + Math.random() * 7000) / simulationSpeed;
              const doctorId = doctor.id;
              const timeout = setTimeout(() => {
                activeTimeoutsRef.current.delete(timeout);
                setDoctors(prev => prev.map(d => 
                  d.id === doctorId ? { ...d, busy: false, patient: null } : d
                ));
                setDoctorPatients(prev => prev.filter(p => p.id !== updatedPatient.id));
                setCompletedPatients(prev => {
                  // بررسی تکراری نبودن
                  if (prev.some(p => p.id === updatedPatient.id)) {
                    return prev;
                  }
                  const endTime = new Date();
                  const waitTime = (endTime.getTime() - updatedPatient.startTime.getTime()) / 1000 / 60;
                  const actualVisitTime = visitTime / 1000 / 60; // تبدیل از میلی‌ثانیه به دقیقه
                  const updated: Patient = { 
                    ...updatedPatient, 
                    status: 'done', 
                    waitTime,
                    visitTime: actualVisitTime
                  };
                  
                  setStats(prevStats => {
                    const newWaitTimes = [...prevStats.waitTimes, waitTime];
                    const newVisitTimes = [...prevStats.visitTimes, actualVisitTime];
                    return {
                      avgWaitTime: newWaitTimes.reduce((a, b) => a + b, 0) / newWaitTimes.length,
                      totalVisits: prevStats.totalVisits + 1,
                      waitTimes: newWaitTimes,
                      visitTimes: newVisitTimes
                    };
                  });
                  
                  return [...prev, updated];
                });
              }, visitTime);
              activeTimeoutsRef.current.add(timeout);
            }
          }
        }

        if (patientsToAdd.length > 0) {
          setDoctorPatients(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newPatients = patientsToAdd.filter(p => !existingIds.has(p.id));
            console.debug('[sim] assign to doctor', newPatients.map(p => p.id), 'doctorId', newDoctors[0].id);
            return [...prev, ...newPatients];
          });
          setWaitingPatients(newWaiting);
          console.debug('[sim] new waitingIds after assign', newWaiting.map(p => p.id));
          return newDoctors;
        }
        
        return prevDoctors;
      });
      return prevWaiting;
    });
  }, [simulationSpeed]);

  // پردازش مرحله‌ای
  const processNextPatient = useCallback(() => {
    processReceptionQueue();
    processPaymentQueue();
    processDoctorQueue();
  }, [processReceptionQueue, processPaymentQueue, processDoctorQueue]);

  // شروع یا توقف شبیه‌سازی
  const toggleSimulation = useCallback(() => {
    setIsRunning(prev => {
      if (!prev) {
        // شروع - پاک کردن timeouts قبلی
        activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
        activeTimeoutsRef.current.clear();
        processingPaymentRef.current.clear();
      }
      return !prev;
    });
  }, []);

  // ساعت کلینیک
  useEffect(() => {
    if (clockIntervalRef.current) {
      clearInterval(clockIntervalRef.current);
    }
    
    if (isRunning) {
      clockIntervalRef.current = setInterval(() => {
        setClinicTime(prev => {
          const newTime = new Date(prev);
          newTime.setMinutes(newTime.getMinutes() + 1);
          return newTime;
        });
      }, 1000 / simulationSpeed);
    }

    return () => {
      if (clockIntervalRef.current) {
        clearInterval(clockIntervalRef.current);
      }
    };
  }, [isRunning, simulationSpeed]);

  // حلقه اصلی شبیه‌سازی
  useEffect(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }

    if (isRunning) {
      simulationIntervalRef.current = setInterval(() => {
        processNextPatient();
      }, 500 / simulationSpeed);
    }

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, [isRunning, simulationSpeed, processNextPatient]);

  // بررسی خالی بودن و توقف خودکار
  useEffect(() => {
    if (!isRunning) return;

    const checkEmpty = setInterval(() => {
      const isEmpty = 
        entrancePatients.length === 0 &&
        waitingPatients.length === 0 &&
        receptionPatients.length === 0 &&
        paymentPatients.length === 0 &&
        doctorPatients.length === 0 &&
        receptionDoneQueue.length === 0 &&
        !doctors.some(doc => doc.busy) &&
        !receptionBooths.some(booth => booth.busy);
      
      if (isEmpty) {
        setIsRunning(false);
        setTimeout(() => alert('تمام بیماران ویزیت شدند!'), 100);
      }
    }, 1000);

    return () => clearInterval(checkEmpty);
  }, [isRunning, entrancePatients.length, waitingPatients.length, receptionPatients.length, paymentPatients.length, doctorPatients.length, receptionDoneQueue.length, doctors, receptionBooths]);

  // پاک کردن timeouts هنگام unmount
  useEffect(() => {
    return () => {
      activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      activeTimeoutsRef.current.clear();
      processingPaymentRef.current.clear();
    };
  }, []);

  return {
    // State
    entrancePatients,
    waitingPatients,
    receptionPatients,
    paymentPatients,
    doctorPatients,
    completedPatients,
    receptionDoneQueue,
    receptionBooths,
    doctors,
    isRunning,
    simulationSpeed,
    clinicTime,
    stats,
    // Actions
    addPatient,
    updateReceptionCount,
    updateDoctorCount,
    toggleSimulation,
    setSimulationSpeed
  };
}
