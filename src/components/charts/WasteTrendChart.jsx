import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { formatDateShort } from '../../utils/formatters';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Palette constants matching Tailwind config
const CLAY    = '#C8553D';
const CLAY_BG = 'rgba(200, 85, 61, 0.10)';

/**
 * WasteTrendChart — line chart showing waste % over a date range.
 * @param {Array} data - Array of { date, wastePercent } objects
 */
export default function WasteTrendChart({ data = [] }) {
  const labels   = data.map(d => formatDateShort(d.date));
  const percents = data.map(d => d.wastePercent);

  const chartData = {
    labels,
    datasets: [{
      label: 'Waste %',
      data: percents,
      borderColor: CLAY,
      backgroundColor: CLAY_BG,
      pointBackgroundColor: CLAY,
      pointBorderColor: '#FFFDF8',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: true,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#2E2A25',
        titleColor: '#FFFDF8',
        bodyColor: '#E6DCC8',
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: ctx => ` ${ctx.parsed.y.toFixed(1)}% waste`,
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
        grid: { color: '#E6DCC8', drawBorder: false },
        ticks: { color: '#7A7168', font: { size: 11 }, callback: v => `${v}%` },
        border: { display: false },
        min: 0,
      },
    },
  };

  return (
    <div style={{ height: 200 }}>
      <Line data={chartData} options={options} />
    </div>
  );
}
