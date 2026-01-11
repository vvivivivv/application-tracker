import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ActivityChart({ weeklyData }) {
  const labels = Object.keys(weeklyData || {});
  const counts = Object.values(weeklyData || {});

  if (labels.length === 0) {
    return (
      <div className="h-40 w-full flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest text-center px-4">
          No application activity <br /> in the last 14 days
        </p>
      </div>
    );
  }

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Applications',
        data: counts,
        backgroundColor: '#3b82f6',
        hoverBackgroundColor: '#2563eb',
        borderRadius: 6,
        barThickness: 20,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 12,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold', size: 9 }, color: '#94a3b8' }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9', drawBorder: false },
        ticks: { font: { size: 10 }, color: '#94a3b8', stepSize: 1 }
      },
    },
  };

  return (
    <div className="h-40 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}