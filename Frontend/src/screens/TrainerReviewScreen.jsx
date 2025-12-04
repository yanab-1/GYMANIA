// frontend/src/screens/TrainerReviewScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import API from '../api/axios';
import { Dumbbell, BarChart, Clock, List, ArrowLeft, Send } from 'lucide-react';

// Re-using the chart components from ProgressTrackingScreen for integration
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


const TrainerReviewScreen = () => {
    const { clientId } = useParams(); // Get client ID from URL
    const navigate = useNavigate();
    
    const [client, setClient] = useState(null);
    const [history, setHistory] = useState([]);
    const [availableExercises, setAvailableExercises] = useState([]);
    const [selectedExerciseId, setSelectedExerciseId] = useState('');
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [feedback, setFeedback] = useState('');

    // --- Step 1: Fetch Client Profile and Workout History ---
    useEffect(() => {
        const fetchClientData = async () => {
            try {
                // Fetch the specific client's profile (We need to modify the backend /api/users/profile to accept a query param if role is trainer)
                // For simplicity now, let's assume we can fetch the list of members and filter
                const { data: membersData } = await API.get('/users/members');
                const selectedClient = membersData.find(m => m._id === clientId);
                
                if (!selectedClient) {
                    setError('Client not found.');
                    setLoading(false);
                    return;
                }
                setClient(selectedClient);

                // Fetch workout history for the client
                const { data: historyData } = await API.get(`/workouts/log/history?memberId=${clientId}`);
                setHistory(historyData);
                
                // Fetch exercise catalog
                const { data: exercisesData } = await API.get('/workouts/exercises');
                setAvailableExercises(exercisesData);
                
                if (exercisesData.length > 0) {
                    setSelectedExerciseId(exercisesData[0]._id); 
                }

            } catch (err) {
                setError('Failed to load client data or history.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClientData();
    }, [clientId]);

    // --- Step 2: Fetch Strength Progress Data (when exercise changes) ---
    useEffect(() => {
        if (!selectedExerciseId || !clientId) return;

        const fetchProgress = async () => {
            try {
                // Use the existing progress endpoint, passing the clientId as a query parameter
                const { data } = await API.get(`/workouts/progress/${selectedExerciseId}?memberId=${clientId}`);
                
                if (data.data.length === 0) {
                    setChartData(null);
                    return;
                }

                // Map data for Chart.js
                const chartConfig = {
                    labels: data.data.map(item => item.date), 
                    datasets: [{
                        label: `Max Weight Lifted (kg) for ${data.exerciseName}`,
                        data: data.data.map(item => item.maxWeight),
                        borderColor: 'rgb(79, 70, 229)',
                        backgroundColor: 'rgba(79, 70, 229, 0.5)',
                        tension: 0.2,
                        pointRadius: 6,
                    }],
                };
                setChartData(chartConfig);
            } catch (err) {
                console.error("Failed to fetch progress chart data:", err);
                setChartData(null);
            }
        };

        fetchProgress();
    }, [selectedExerciseId, clientId]);


    // --- Step 3: Handle Feedback Submission (Placeholder) ---
    const handleSubmitFeedback = (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;
        
        // **TO DO:** Implement /api/notifications or /api/trainer/feedback endpoint
        console.log(`Sending feedback to ${client.name}: ${feedback}`);
        alert(`Feedback submitted to ${client.name}! (API integration needed)`);
        setFeedback('');
    };
    
    // Chart options (reused from ProgressTrackingScreen)
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Strength Progress Over Time' },
        },
        scales: {
            y: { title: { display: true, text: 'Max Weight (kg)' }, beginAtZero: true },
            x: { title: { display: true, text: 'Date' } }
        }
    };

    if (loading) return <MainLayout><div className="text-center py-10">Loading Client Review...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-center py-10 text-red-500">{error}</div></MainLayout>;

    return (
        <MainLayout>
            <button onClick={() => navigate('/trainer/clients')} className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
                <ArrowLeft className="w-5 h-5 mr-2" /> Back to Client List
            </button>
            <h1 className="text-3xl font-bold mb-4">🏋️ Review: {client.name}</h1>
            <p className="text-gray-600 mb-8">Analyze their history and assign feedback.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: History List */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4 flex items-center"><List className="w-5 h-5 mr-2" /> Workout History ({history.length})</h2>
                    {history.length === 0 ? (
                        <p className="text-gray-500">No workout logs found for this client.</p>
                    ) : (
                        <ul className="space-y-3">
                            {history.map(log => (
                                <li key={log._id} className="p-3 border rounded-md hover:bg-gray-50">
                                    <p className="font-medium text-gray-800">{new Date(log.date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-500">Duration: {log.durationMinutes || '--'} mins</p>
                                    <p className="text-xs text-gray-400">Exercises: {log.exercises.length}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Column 2 & 3: Progress Chart and Feedback */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Progress Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><BarChart className="w-5 h-5 mr-2" /> Strength Progress</h2>
                        
                        <div className="flex items-center space-x-4 mb-4">
                            <label className="text-md font-medium text-gray-700">Track Exercise:</label>
                            <select
                                value={selectedExerciseId}
                                onChange={(e) => setSelectedExerciseId(e.target.value)}
                                className="py-2 px-3 border border-gray-300 rounded-md shadow-sm"
                            >
                                {availableExercises.map(ex => (
                                    <option key={ex._id} value={ex._id}>{ex.name}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="h-[400px]">
                            {chartData ? (
                                <Line options={chartOptions} data={chartData} />
                            ) : (
                                <div className="text-center py-20 text-gray-500">No data logged for the selected exercise.</div>
                            )}
                        </div>
                    </div>

                    {/* Feedback Form */}
                    <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-indigo-500">
                        <h2 className="text-xl font-semibold mb-4 flex items-center"><Send className="w-5 h-5 mr-2" /> Send Feedback</h2>
                        <form onSubmit={handleSubmitFeedback}>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                rows="4"
                                placeholder={`Write feedback, recommendations, or diet adjustments for ${client.name}...`}
                            />
                            <button
                                type="submit"
                                disabled={!feedback.trim()}
                                className="mt-3 w-full py-2 px-4 rounded-md text-white font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
                            >
                                Send Notification to Client
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TrainerReviewScreen;