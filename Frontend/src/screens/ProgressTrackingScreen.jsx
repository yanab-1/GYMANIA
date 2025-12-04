// frontend/src/screens/ProgressTrackingScreen.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import API from '../api/axios';

// Chart Imports
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend
);

const ProgressTrackingScreen = () => {
  const [availableExercises, setAvailableExercises] = useState([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the master list of exercises to populate the dropdown
    const fetchExercises = async () => {
      try {
        const { data } = await API.get('/workouts/exercises');
        setAvailableExercises(data);
        if (data.length > 0) {
            // Select the first exercise by default
            setSelectedExerciseId(data[0]._id); 
        }
      } catch (err) {
        setMessage('Failed to load exercise list.');
      }
    };
    fetchExercises();
  }, []);

  useEffect(() => {
    if (!selectedExerciseId) return;

    const fetchProgress = async () => {
      setLoading(true);
      setChartData(null);
      setMessage('');

      try {
        const { data } = await API.get(`/workouts/progress/${selectedExerciseId}`);

        if (data.data.length === 0) {
            setMessage(`No logs found for ${data.exerciseName}. Try logging a workout!`);
            setLoading(false);
            return;
        }

        // Map the aggregated data to the format Chart.js expects
        const chartConfig = {
          labels: data.data.map(item => item.date), // Dates on X-axis
          datasets: [
            {
              label: `Max Weight Lifted (kg) for ${data.exerciseName}`,
              data: data.data.map(item => item.maxWeight), // Weights on Y-axis
              borderColor: 'rgb(79, 70, 229)',
              backgroundColor: 'rgba(79, 70, 229, 0.5)',
              tension: 0.1,
              pointRadius: 5,
              pointHoverRadius: 8,
            },
          ],
        };
        setChartData(chartConfig);
        setMessage(`Progress for ${data.exerciseName} loaded successfully.`);

      } catch (err) {
        setMessage('Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [selectedExerciseId]); // Re-fetch whenever a new exercise is selected

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Strength Progress Over Time' },
    },
    scales: {
        y: {
            title: { display: true, text: 'Max Weight (kg)' },
            beginAtZero: true
        },
        x: {
             title: { display: true, text: 'Date' }
        }
    }
  };

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">🎯 Strength Progress Tracker</h1>

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6 flex items-center space-x-4">
        <label className="text-lg font-medium text-gray-700">Select Exercise:</label>
        <select
          value={selectedExerciseId}
          onChange={(e) => setSelectedExerciseId(e.target.value)}
          className="py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          {availableExercises.map(ex => (
            <option key={ex._id} value={ex._id}>
              {ex.name}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg">
        {loading && <div className="text-center py-10 text-indigo-600">Loading progress data...</div>}
        {message && !chartData && <div className="text-center py-10 text-gray-500">{message}</div>}

        {chartData && (
          <div style={{ height: '500px' }}>
            <Line options={options} data={chartData} />
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProgressTrackingScreen;
