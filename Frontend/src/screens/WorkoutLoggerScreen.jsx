// frontend/src/screens/WorkoutLoggerScreen.jsx
import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import API from '../api/axios';
import { PlusCircle, Trash2, Save, XCircle } from 'lucide-react';

const initialExercise = {
  exerciseId: '',
  exerciseName: '',
  sets: [{ reps: '', weight: '' }],
};

const WorkoutLoggerScreen = () => {
  const [availableExercises, setAvailableExercises] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [durationMinutes, setDurationMinutes] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the master list of exercises
    const fetchExercises = async () => {
      try {
        const { data } = await API.get('/workouts/exercises');
        setAvailableExercises(data);
      } catch (err) {
        setMessage('Failed to load exercise catalog.');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, []);

  const addExercise = () => {
    setCurrentWorkout([...currentWorkout, { ...initialExercise }]);
  };

  const handleExerciseChange = (index, exerciseId) => {
    const exercise = availableExercises.find(e => e._id === exerciseId);
    const updatedWorkout = [...currentWorkout];

    updatedWorkout[index].exerciseId = exerciseId;
    updatedWorkout[index].exerciseName = exercise ? exercise.name : '';

    setCurrentWorkout(updatedWorkout);
  };

  const handleSetChange = (exIndex, setIndex, field, value) => {
    const updatedWorkout = [...currentWorkout];
    updatedWorkout[exIndex].sets[setIndex][field] = value;
    setCurrentWorkout(updatedWorkout);
  };

  const addSet = (index) => {
    const updatedWorkout = [...currentWorkout];
    updatedWorkout[index].sets.push({ reps: '', weight: '' });
    setCurrentWorkout(updatedWorkout);
  };

  const removeSet = (exIndex, setIndex) => {
    const updatedWorkout = [...currentWorkout];
    updatedWorkout[exIndex].sets.splice(setIndex, 1);
    setCurrentWorkout(updatedWorkout);
  };

  const removeExercise = (index) => {
    const updatedWorkout = currentWorkout.filter((_, i) => i !== index);
    setCurrentWorkout(updatedWorkout);
  };

  const handleSubmit = async () => {
    setMessage('');

    // Basic Validation
    if (currentWorkout.length === 0) {
      setMessage('Please log at least one exercise.');
      return;
    }

    // Clean up data before sending
    const payload = {
      durationMinutes: Number(durationMinutes) || undefined,
      notes: workoutNotes,
      exercises: currentWorkout.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => ({
          reps: Number(set.reps),
          weight: Number(set.weight) || 0,
        })).filter(set => set.reps > 0) // Only send valid sets
      })).filter(ex => ex.exerciseId && ex.sets.length > 0) // Only send valid exercises
    };

    if (payload.exercises.length === 0) {
        setMessage('Please ensure all logged exercises have at least one set with reps defined.');
        return;
    }

    try {
      const { data } = await API.post('/workouts/log', payload);
      setMessage(`✅ ${data.message}`);

      // Reset form on success
      setCurrentWorkout([]);
      setDurationMinutes('');
      setWorkoutNotes('');

    } catch (err) {
      setMessage(`❌ Failed to log workout: ${err.response?.data?.message || 'Server Error'}`);
    }
  };

  if (loading) return <MainLayout>Loading Exercises...</MainLayout>;

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold mb-6">Log Today's Workout</h1>
      {message && <div className={`p-3 rounded mb-4 ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Duration (Minutes)</label>
                <input
                    type="number"
                    min="0"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="e.g., 60"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Workout Notes</label>
                <input
                    type="text"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    placeholder="e.g., Feeling strong today!"
                />
            </div>
        </div>

        <h2 className="text-xl font-semibold mt-4 mb-4">Exercises</h2>

        {currentWorkout.map((ex, exIndex) => (
          <div key={exIndex} className="bg-gray-50 p-4 mb-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-3">
                <select
                    value={ex.exerciseId}
                    onChange={(e) => handleExerciseChange(exIndex, e.target.value)}
                    className="block w-full max-w-sm py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                >
                    <option value="">-- Select Exercise --</option>
                    {availableExercises.map(aEx => (
                        <option key={aEx._id} value={aEx._id}>{aEx.name} ({aEx.category})</option>
                    ))}
                </select>
                <button onClick={() => removeExercise(exIndex)} className="text-red-500 hover:text-red-700 ml-4 p-2 rounded-full hover:bg-red-100">
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Set</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reps</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight (kg)</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {ex.sets.map((set, setIndex) => (
                            <tr key={setIndex}>
                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{setIndex + 1}</td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <input
                                        type="number"
                                        min="1"
                                        value={set.reps}
                                        onChange={(e) => handleSetChange(exIndex, setIndex, 'reps', e.target.value)}
                                        className="w-20 border border-gray-300 rounded-md p-1 text-sm"
                                        placeholder="Reps"
                                    />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap">
                                    <input
                                        type="number"
                                        min="0"
                                        value={set.weight}
                                        onChange={(e) => handleSetChange(exIndex, setIndex, 'weight', e.target.value)}
                                        className="w-20 border border-gray-300 rounded-md p-1 text-sm"
                                        placeholder="Weight"
                                    />
                                </td>
                                <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => removeSet(exIndex, setIndex)} className="text-red-400 hover:text-red-600">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button
                onClick={() => addSet(exIndex)}
                className="mt-3 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 p-1"
            >
                <PlusCircle className="w-4 h-4 mr-1" /> Add Set
            </button>
          </div>
        ))}

        <button
          onClick={addExercise}
          className="mt-4 flex items-center py-2 px-4 border border-indigo-600 rounded-md text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition duration-150"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Exercise
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={currentWorkout.length === 0}
        className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${
          currentWorkout.length === 0 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150`}
      >
        <Save className="w-6 h-6 mr-2" />
        Finish & Log Workout
      </button>
    </MainLayout>
  );
};

export default WorkoutLoggerScreen;