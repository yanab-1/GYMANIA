// frontend/src/screens/ClientManagementScreen.jsx
import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/MainLayout';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';
import { User, Dumbbell, ClipboardList, PlusCircle, Trash2, BarChart, Clock, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // <--- useNavigate is correctly imported

const ClientManagementScreen = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedClient, setSelectedClient] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                // Fetch members, only accessible by Trainer/Admin
                const { data } = await API.get('/users/members'); 
                setClients(data);
                setError(null);
            } catch (err) {
                setError('Failed to fetch client list. Ensure API is running and you are logged in as a Trainer/Admin.');
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    const ClientCard = ({ client }) => (
        <div 
            onClick={() => setSelectedClient(client)}
            className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                selectedClient?._id === client._id ? 'border-indigo-600 ring-2 ring-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
            }`}
        >
            <div className="font-semibold text-gray-800">{client.name}</div>
            <div className="text-sm text-gray-500">{client.email}</div>
            <div className={`text-xs mt-1 font-medium ${client.membership.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                Membership: {client.membership.status.toUpperCase()}
            </div>
        </div>
    );

    if (loading) return <MainLayout><div className="text-center py-10">Loading Client List...</div></MainLayout>;
    if (error) return <MainLayout><div className="text-center py-10 text-red-500">{error}</div></MainLayout>;

    return (
        <MainLayout>
            <h1 className="text-3xl font-bold mb-8">Client Management Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Column 1: Client List */}
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto">
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">Your Active Clients ({clients.length})</h2>
                    <div className="space-y-3">
                        {clients.map(client => (
                            <ClientCard key={client._id} client={client} />
                        ))}
                    </div>
                </div>

                {/* Column 2 & 3: Client Details / Routine Builder */}
                <div className="md:col-span-2 space-y-8">
                    {selectedClient ? (
                        <>
                            <ClientDetailView client={selectedClient} />
                            <RoutineBuilder client={selectedClient} />
                        </>
                    ) : (
                        <div className="bg-white p-10 rounded-lg shadow-lg text-center text-gray-500">
                            <User className="w-8 h-8 mx-auto mb-3" />
                            Select a client from the list to view their details and assign a routine.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

// Trainer Sub-Component: Client Profile View (FIXED LINKING)
const ClientDetailView = ({ client }) => {
    const navigate = useNavigate();
    
    // FIX: Modified to link directly to the TrainerReviewScreen
    const handleViewProgress = () => {
        navigate(`/trainer/review/${client._id}`); 
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">Client Profile: {client.name}</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
                <p><span className="font-medium">Email:</span> {client.email}</p>
                <p><span className="font-medium">Joined:</span> {new Date(client.createdAt).toLocaleDateString()}</p>
                <p><span className="font-medium">Membership Status:</span> <span className={`font-bold ${client.membership.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{client.membership.status.toUpperCase()}</span></p>
                {client.membership.endDate && (
                    <p><span className="font-medium">Expiry:</span> {new Date(client.membership.endDate).toLocaleDateString()}</p>
                )}
            </div>
            <button 
                onClick={handleViewProgress} // <--- Now navigates to the review screen
                className="mt-4 flex items-center text-indigo-600 hover:text-indigo-800 font-medium text-sm border-b border-indigo-600 pb-1"
            >
                <BarChart className="w-4 h-4 mr-1" /> View Workout History & Progress
            </button>
        </div>
    );
};

// Trainer Sub-Component: Routine Builder (content remains the same)
const RoutineBuilder = ({ client }) => {
    const [availableExercises, setAvailableExercises] = useState([]);
    const [routineName, setRoutineName] = useState('');
    const [routineDescription, setRoutineDescription] = useState('');
    const [routineExercises, setRoutineExercises] = useState([{ id: Date.now(), ...getInitialRoutineExercise() }]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    function getInitialRoutineExercise() {
        return { exerciseId: '', exerciseName: '', sets: '', reps: '', weightGuidance: '', notes: '' };
    }

    useEffect(() => {
        // Fetch the master exercise catalog
        const fetchExercises = async () => {
            try {
                const { data } = await API.get('/workouts/exercises');
                setAvailableExercises(data);
            } catch (err) {
                console.error("Failed to load exercises:", err);
            }
        };
        fetchExercises();
    }, []);

    const addExerciseToRoutine = () => {
        setRoutineExercises([...routineExercises, { id: Date.now(), ...getInitialRoutineExercise() }]);
    };
    
    const removeRoutineExercise = (id) => {
        setRoutineExercises(routineExercises.filter(ex => ex.id !== id));
    };

    const handleExerciseChange = (index, field, value) => {
        const updatedExercises = [...routineExercises];
        updatedExercises[index][field] = value;
        
        if (field === 'exerciseId') {
            const exercise = availableExercises.find(ex => ex._id === value);
            updatedExercises[index].exerciseName = exercise ? exercise.name : '';
        }

        setRoutineExercises(updatedExercises);
    };

    const handleSubmitRoutine = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        const validExercises = routineExercises.filter(ex => ex.exerciseId && ex.sets && ex.reps)
            .map(({ id, ...rest }) => ({ ...rest, sets: Number(rest.sets) }));

        if (!routineName || validExercises.length === 0) {
            setMessage('Routine must have a name and at least one exercise with sets/reps defined.');
            setLoading(false);
            return;
        }

        const payload = {
            memberId: client._id,
            name: routineName,
            description: routineDescription,
            exercises: validExercises,
        };

        try {
            const { data } = await API.post('/routines', payload);
            setMessage(`✅ ${data.message}`);
            // Reset form
            setRoutineName('');
            setRoutineDescription('');
            setRoutineExercises([{ id: Date.now(), ...getInitialRoutineExercise() }]);
        } catch (err) {
            setMessage(`❌ Failed to assign routine: ${err.response?.data?.message || 'Server error.'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-teal-500">
            <h2 className="text-2xl font-bold mb-4 flex items-center text-teal-600">
                <ClipboardList className="w-6 h-6 mr-2" /> Assign New Routine
            </h2>
            <p className="mb-4 text-sm text-gray-600">Assigning a new routine will deactivate the client's current active plan.</p>
            
            {message && <div className={`p-3 rounded mb-4 text-sm ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

            <form onSubmit={handleSubmitRoutine}>
                {/* Routine Info Inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input type="text" placeholder="Routine Name" value={routineName} onChange={(e) => setRoutineName(e.target.value)} className="col-span-2 p-2 border border-gray-300 rounded-md" required />
                    <textarea placeholder="Routine Description/Notes" value={routineDescription} onChange={(e) => setRoutineDescription(e.target.value)} className="col-span-2 p-2 border border-gray-300 rounded-md" rows="2" />
                </div>

                <h3 className="font-semibold text-gray-700 mb-2 mt-4">Exercises in Routine</h3>
                
                {routineExercises.map((ex, index) => (
                    <div key={ex.id} className="grid grid-cols-12 gap-2 p-3 mb-2 bg-gray-50 border rounded-md items-center text-xs">
                        {/* Exercise Selector */}
                        <div className="col-span-4">
                            <select value={ex.exerciseId} onChange={(e) => handleExerciseChange(index, 'exerciseId', e.target.value)} className="w-full p-2 border-gray-300 rounded-md" required>
                                <option value="">Select Exercise</option>
                                {availableExercises.map(aEx => (<option key={aEx._id} value={aEx._id}>{aEx.name}</option>))}
                            </select>
                        </div>
                        
                        {/* Sets / Reps / Weight Guidance */}
                        <input type="number" min="1" placeholder="Sets" value={ex.sets} onChange={(e) => handleExerciseChange(index, 'sets', e.target.value)} className="col-span-2 p-2 border-gray-300 rounded-md text-center" required />
                        <input type="text" placeholder="Reps" value={ex.reps} onChange={(e) => handleExerciseChange(index, 'reps', e.target.value)} className="col-span-2 p-2 border-gray-300 rounded-md text-center" required />
                        <input type="text" placeholder="Weight (e.g., 30kg/RPE 8)" value={ex.weightGuidance} onChange={(e) => handleExerciseChange(index, 'weightGuidance', e.target.value)} className="col-span-3 p-2 border-gray-300 rounded-md" />
                        
                        {/* Remove Button */}
                        <button type="button" onClick={() => removeRoutineExercise(ex.id)} className="col-span-1 text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-4 h-4 mx-auto" />
                        </button>
                        
                        {/* Notes */}
                        <input type="text" placeholder="Notes (e.g., slow eccentric)" value={ex.notes} onChange={(e) => handleExerciseChange(index, 'notes', e.target.value)} className="col-span-12 p-2 border-gray-300 rounded-md" />
                    </div>
                ))}

                <button type="button" onClick={addExerciseToRoutine} className="mt-3 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500 p-1">
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Exercise to Routine
                </button>

                <button type="submit" className="w-full mt-6 py-3 px-4 rounded-md text-white font-semibold bg-teal-600 hover:bg-teal-700 transition duration-150 disabled:bg-gray-400" disabled={loading || !routineName || routineExercises.filter(ex => ex.exerciseId).length === 0}>
                    {loading ? 'Assigning...' : 'Assign Routine to Client'}
                </button>
            </form>
        </div>
    );
};

export default ClientManagementScreen;