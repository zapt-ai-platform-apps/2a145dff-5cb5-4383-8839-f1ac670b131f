import { createSignal, onMount, Show } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';
import Calendar from '../components/Calendar';

function Home(props) {
  const navigate = useNavigate();
  const [timetable, setTimetable] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      // Fetch the generated timetable from the backend
      // TODO: Implement API call to fetch timetable
      const mockTimetable = [
        // Mock data representing revision sessions
        {
          id: 1,
          subject: 'Mathematics',
          topic: 'Algebra',
          date: '2023-11-01',
          time: 'morning',
          completed: false,
        },
        // Add more sessions as needed
      ];
      setTimetable(mockTimetable);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    if (!props.user()) {
      navigate('/');
    } else {
      fetchTimetable();
    }
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const markSession = async (sessionId, completed) => {
    setLoading(true);
    try {
      // Update the session status in the backend
      // TODO: Implement API call to update session status
      setTimetable(
        timetable().map((session) =>
          session.id === sessionId ? { ...session, completed } : session
        )
      );
    } catch (error) {
      console.error('Error updating session:', error);
    } finally {
      setLoading(false);
    }
  };

  const rescheduleSession = async (sessionId, newDate, newTime) => {
    setLoading(true);
    try {
      // Update the session date and time in the backend
      // TODO: Implement API call to reschedule session
      setTimetable(
        timetable().map((session) =>
          session.id === sessionId ? { ...session, date: newDate, time: newTime } : session
        )
      );
    } catch (error) {
      console.error('Error rescheduling session:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen h-full bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600">Revision Timetable</h1>
          <button
            class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>

        <Show when={!loading()} fallback={<p>Loading timetable...</p>}>
          <Calendar
            timetable={timetable()}
            onMarkSession={markSession}
            onRescheduleSession={rescheduleSession}
          />
        </Show>
      </div>
    </div>
  );
}

export default Home;