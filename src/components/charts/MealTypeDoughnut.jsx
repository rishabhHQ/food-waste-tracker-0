import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { capitalise } from '../../utils/formatters';

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ['#C8553D', '#6B8F4E', '#D9A441'];

/**
 * MealTypeDoughnut — waste breakdown by meal type.
 * @param {object} data - { breakfast: { wasted, prepared }, lunch: {...}, dinner: {...} }
 */
export default function MealTypeDoughnut({ data = {} }) {
  const labels = Object.keys(data).map(capitalise);
  const values = Object.values(data).map(d => +(d.wasted ?? 0).toFixed(1));

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: COLORS.slice(0, labels.length),
      borderColor: '#FFFDF8',
      borderWidth: 3,
      hoverOffset: 6,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#7A7168',
          font: { size: 12 },
          boxWidth: 10,
          boxHeight: 10,
          borderRadius: 3,
          useBorderRadius: true,
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: '#2E2A25',
        titleColor: '#FFFDF8',
        bodyColor: '#E6DCC8',
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: ctx => ` ${ctx.parsed.toFixed(1)} kg wasted`,
        },
      },
    },
  };

  return (
    <div style={{ height: 240 }}>
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
