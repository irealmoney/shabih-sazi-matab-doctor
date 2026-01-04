'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatsChartProps {
  stats: {
    avgWaitTime: number;
    totalVisits: number;
    waitTimes: number[];
    visitTimes: number[];
  };
}

export default function StatsChart({ stats }: StatsChartProps) {
  const avgVisitTime = stats.visitTimes.length > 0
    ? stats.visitTimes.reduce((a, b) => a + b, 0) / stats.visitTimes.length
    : 0;

  const data = {
    labels: ['زمان انتظار', 'زمان ویزیت'],
    datasets: [
      {
        label: 'میانگین زمان (دقیقه)',
        data: [stats.avgWaitTime, avgVisitTime],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={data} options={options} />;
}

