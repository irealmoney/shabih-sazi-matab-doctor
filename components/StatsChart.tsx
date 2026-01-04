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
    totalCost: number;
  };
}

export default function StatsChart({ stats }: StatsChartProps) {
  const avgVisitTime = stats.visitTimes.length > 0
    ? stats.visitTimes.reduce((a, b) => a + b, 0) / stats.visitTimes.length
    : 0;

  // تبدیل هزینه به هزار تومان برای نمایش بهتر
  const totalCostInThousands = stats.totalCost / 1000;

  const data = {
    labels: ['زمان انتظار', 'زمان ویزیت', 'مجموع هزینه'],
    datasets: [
      {
        label: 'میانگین زمان (دقیقه)',
        data: [stats.avgWaitTime, avgVisitTime, null],
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 255, 255, 0)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 255, 255, 0)'
        ],
        borderWidth: 1,
        yAxisID: 'y'
      },
      {
        label: 'مجموع هزینه (هزار تومان)',
        data: [null, null, totalCostInThousands],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            if (datasetLabel.includes('زمان')) {
              if (value === null || value === undefined) {
                return '';
              }
              return `میانگین زمان: ${value.toFixed(1)} دقیقه`;
            } else if (datasetLabel.includes('هزینه')) {
              const costInTomans = stats.totalCost;
              return `مجموع هزینه: ${costInTomans.toLocaleString('fa-IR')} تومان`;
            }
            return '';
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return value.toFixed(1) + ' دقیقه';
          }
        },
        title: {
          display: true,
          text: 'زمان (دقیقه)'
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value: any) {
            return value.toFixed(0) + ' هزار تومان';
          }
        },
        title: {
          display: true,
          text: 'هزینه (هزار تومان)'
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
}

