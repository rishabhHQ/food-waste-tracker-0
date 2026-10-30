import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { formatDateShort } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OLIVE   = '#6B8F4E';
const CLAY    = '#C8553D';
const MUSTARD = '#D9A441';

/**
 * ConsumptionBarChart — grouped bar chart: consumed vs predicted vs prepared kg.
 * @param {Array} data - [{ date, prepared, consumed, predicted }]
 */
export default function ConsumptionBarChart({ data = [], showPredicted = true }) {
  const labels = data.map(d => formatDateShort(d.date));

  const datasets = [
    {
      label: 'Consumed',
      data: data.map(d => d.consumed?.toFixed(1)),
      backgroundColor: OLIVE,
      borderRadius: 5,
      borderSkipped: false,
    },
    {
      label: 'Prepared',
      data: data.map(d => d.prepared?.toFixed(1)),
      backgroundColor: CLAY,
      borderRadius: 5,
      borderSkipped: false,
    },
  ];

  if (showPredicted) {
    datasets.push({
      label: 'Predicted',
      data: data.map(d => d.predicted?.toFixed(1) ?? d.prepared?.toFixed(1)),
      backgroundColor: MUSTARD,
      borderRadius: 5,
      borderSkipped: false,
    });
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#7A7168',
          font: { size: 11 },
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 3,
          useBorderRadius: true,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: '#2E2A25',
        titleColor: '#FFFDF8',
        bodyColor: '#E6DCC8',
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y} kg`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#7A7168', font: { size: 11 } },
        border: { display: false },
      },
      y: {
        grid: { color: '#E6DCC8' },
        ticks: { color: '#7A7168', font: { size: 11 }, callback: v => `${v} kg` },
        border: { display: false },
        min: 0,
      },
    },
  };

  return (
    <div style={{ height: 260 }}>
      <Bar data={{ labels, datasets }} options={options} />
    </div>
  );
}
