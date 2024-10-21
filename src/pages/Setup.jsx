import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';

function Setup(props) {
  const [exams, setExams] = createSignal([]);
  const [currentExam, setCurrentExam] = createSignal({
    subject: '',
    date: '',
    board: '',
  });
  const [sessionPreferences, setSessionPreferences] = createSignal({
    days: {
      Monday: { morning: false, afternoon: false },
      Tuesday: { morning: false, afternoon: false },
      Wednesday: { morning: false, afternoon: false },
      Thursday: { morning: false, afternoon: false },
      Friday: { morning: false, afternoon: false },
      Saturday: { morning: false, afternoon: false },
      Sunday: { morning: false, afternoon: false },
    },
    sessionLength: 60,
    delayStart: false,
  });
  const [loading, setLoading] = createSignal(false);
  const navigate = useNavigate();

  const addExam = () => {
    if (!currentExam().subject || !currentExam().date) {
      alert('Please fill in the subject and date.');
      return;
    }
    setExams([...exams(), { ...currentExam() }]);
    setCurrentExam({ subject: '', date: '', board: '' });
  };

  const handleDayToggle = (day, time) => {
    setSessionPreferences((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          [time]: !prev.days[day][time],
        },
      },
    }));
  };

  const handleSubmit = async () => {
    if (exams().length === 0) {
      alert('Please add at least one exam.');
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      // Send exams and sessionPreferences to backend
      await fetch('/api/savePreferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exams: exams(),
          sessionPreferences: sessionPreferences(),
        }),
      });
      navigate('/home');
    } catch (error) {
      console.error('Error saving preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen h-full bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 class="text-3xl font-bold mb-6 text-purple-600">Setup Your Revision Schedule</h1>

        <h2 class="text-2xl font-semibold mb-4">Add Your Exams</h2>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Subject"
              value={currentExam().subject}
              onInput={(e) => setCurrentExam({ ...currentExam(), subject: e.target.value })}
              class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            />
            <input
              type="date"
              placeholder="Date"
              value={currentExam().date}
              onInput={(e) => setCurrentExam({ ...currentExam(), date: e.target.value })}
              class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            />
            <input
              type="text"
              placeholder="Board (Optional)"
              value={currentExam().board}
              onInput={(e) => setCurrentExam({ ...currentExam(), board: e.target.value })}
              class="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            />
          </div>
          <button
            onClick={addExam}
            class="mt-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer disabled:opacity-50"
            disabled={loading()}
          >
            Add Exam
          </button>
          <div class="mt-4">
            <h3 class="text-xl font-semibold mb-2">Your Exams:</h3>
            <For each={exams()}>
              {(exam, index) => (
                <div class="flex items-center justify-between mb-2">
                  <p>{`${exam.subject} - ${exam.date} ${exam.board ? '- ' + exam.board : ''}`}</p>
                  <button
                    onClick={() => setExams(exams().filter((_, i) => i !== index()))}
                    class="text-red-500 hover:text-red-700 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </For>
          </div>
        </div>

        <h2 class="text-2xl font-semibold mt-6 mb-4">Set Your Availability</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <For each={Object.keys(sessionPreferences().days)}>
            {(day) => (
              <div class="border p-4 rounded-lg">
                <h3 class="text-xl font-semibold mb-2">{day}</h3>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id={`${day}-morning`}
                    class="cursor-pointer mr-2"
                    checked={sessionPreferences().days[day].morning}
                    onChange={() => handleDayToggle(day, 'morning')}
                  />
                  <label for={`${day}-morning`} class="cursor-pointer">Morning</label>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id={`${day}-afternoon`}
                    class="cursor-pointer mr-2"
                    checked={sessionPreferences().days[day].afternoon}
                    onChange={() => handleDayToggle(day, 'afternoon')}
                  />
                  <label for={`${day}-afternoon`} class="cursor-pointer">Afternoon</label>
                </div>
              </div>
            )}
          </For>
        </div>

        <h2 class="text-2xl font-semibold mt-6 mb-4">Session Length</h2>
        <input
          type="range"
          min="30"
          max="120"
          step="15"
          value={sessionPreferences().sessionLength}
          onInput={(e) =>
            setSessionPreferences({ ...sessionPreferences(), sessionLength: parseInt(e.target.value) })
          }
          class="w-full"
        />
        <p class="text-center mt-2">{sessionPreferences().sessionLength} minutes per session</p>

        <div class="flex items-center mt-4">
          <input
            type="checkbox"
            id="delay-start"
            class="cursor-pointer mr-2"
            checked={sessionPreferences().delayStart}
            onChange={(e) =>
              setSessionPreferences({ ...sessionPreferences(), delayStart: e.target.checked })
            }
          />
          <label for="delay-start" class="cursor-pointer">Delay Start Date by One Week</label>
        </div>

        <button
          onClick={handleSubmit}
          class="mt-6 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer disabled:opacity-50"
          disabled={loading()}
        >
          {loading() ? 'Saving...' : 'Generate Timetable'}
        </button>
      </div>
    </div>
  );
}

export default Setup;