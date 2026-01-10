import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ActivityChart({ weeklyData }) {
  const labels = Object.keys(weeklyData).slice(-5);
  const counts = Object.values(weeklyData).slice(-5);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Applications',
        data: counts,
        backgroundColor: '#3b82f6',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 10,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { weight: 'bold', size: 10 }, color: '#94a3b8' }
      },
      y: {
        beginAtZero: true,
        grid: { color: '#f1f5f9' },
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