import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend } from 'chart.js';
import { Tooltip } from 'react-tooltip';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

function Comparison({ selectedFDs }) {
  if (selectedFDs.length < 2) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-red-500 text-lg font-medium text-center"
      >
        Select at least 2 FDs from the home page to compare.
      </motion.p>
    );
  }

  const parseToMonths = (str) => {
    if (str === 'None') return 0;
    const parts = str.split(' ');
    if (parts.length !== 2) return 0;
    const num = parseFloat(parts[0]);
    const unit = parts[1].toLowerCase();
    if (unit.includes('year')) return num * 12;
    if (unit.includes('month')) return num;
    return 0;
  };

  const chartDataInterest = {
    labels: selectedFDs.map((fd) => fd.issuer),
    datasets: [
      {
        label: 'Interest Rate (%)',
        data: selectedFDs.map((fd) => fd.interest_rate),
        backgroundColor: ['#3B82F6', '#EAB308', '#10B981'],
        borderColor: ['#2563EB', '#CA8A04', '#059669'],
        borderWidth: 1,
      },
    ],
  };

  const chartDataTenure = {
    labels: selectedFDs.map((fd) => fd.issuer),
    datasets: [
      {
        label: 'Tenure (months)',
        data: selectedFDs.map((fd) => parseToMonths(fd.tenure)),
        backgroundColor: ['#10B981', '#34D399', '#6EE7B7'],
        borderColor: ['#059669', '#059669', '#059669'],
        borderWidth: 1,
      },
    ],
  };

  const chartDataLockin = {
    labels: selectedFDs.map((fd) => fd.issuer),
    datasets: [
      {
        label: 'Lock-in Period (months)',
        data: selectedFDs.map((fd) => parseToMonths(fd.lock_in_period)),
        backgroundColor: ['#F59E0B', '#FBBF24', '#FCD34D'],
        borderColor: ['#D97706', '#D97706', '#D97706'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptionsInterest = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      title: { display: true, text: 'Interest Rate Comparison', font: { size: 18, weight: 'bold' } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Interest Rate (%)', font: { size: 14 } } },
      x: { title: { display: true, text: 'FD Issuer', font: { size: 14 } } },
    },
    animation: { duration: 1000, easing: 'easeInOutQuart' },
  };

  const chartOptionsTenure = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      title: { display: true, text: 'Tenure Comparison', font: { size: 18, weight: 'bold' } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Months', font: { size: 14 } } },
      x: { title: { display: true, text: 'FD Issuer', font: { size: 14 } } },
    },
    animation: { duration: 1000, easing: 'easeInOutQuart' },
  };

  const chartOptionsLockin = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { font: { size: 14 } } },
      title: { display: true, text: 'Lock-in Period Comparison', font: { size: 18, weight: 'bold' } },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Months', font: { size: 14 } } },
      x: { title: { display: true, text: 'FD Issuer', font: { size: 14 } } },
    },
    animation: { duration: 1000, easing: 'easeInOutQuart' },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-4xl font-bold text-bank-blue">Compare Fixed Deposits</h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-bank-blue"
      >
        <Bar data={chartDataInterest} options={chartOptionsInterest} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-bank-blue"
      >
        <Bar data={chartDataTenure} options={chartOptionsTenure} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-6 rounded-xl shadow-lg border border-bank-blue"
      >
        <Bar data={chartDataLockin} options={chartOptionsLockin} />
      </motion.div>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {selectedFDs.map((fd, index) => (
          <motion.div
            key={fd.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border p-6 rounded-xl shadow-lg bg-white min-w-[280px] hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-bank-blue"
          >
            <h2 className="text-xl font-semibold text-bank-blue mb-3">{fd.issuer}</h2>
            <p className="text-gray-600">Interest Rate: {fd.interest_rate}%</p>
            <p className="text-gray-600">Tenure: {fd.tenure}</p>
            <div
              className={
                fd.rating === 'AAA' ? 'text-bank-accent font-bold' : 'text-yellow-500 font-bold'
              }
            >
              Rating: {fd.rating}{' '}
              <span
                data-tooltip-id={`rating-comp-${fd.id}`}
                data-tooltip-content="AAA: Highest safety; AA+: Very high safety."
                className="text-bank-blue cursor-help"
              >
                ℹ️
              </span>
              <Tooltip id={`rating-comp-${fd.id}`} place="top" />
            </div>
            <div className="text-gray-600">Lock-in: {fd.lock_in_period}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Comparison;