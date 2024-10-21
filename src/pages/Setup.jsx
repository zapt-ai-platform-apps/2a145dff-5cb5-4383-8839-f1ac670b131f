import { createSignal, onMount, Show, For } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { supabase } from '../supabaseClient';

function Setup(props) {
  const [examInfo, setExamInfo] = createSignal([]);
  const [selectedExams, setSelectedExams] = createSignal([]);
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

  const fetchExamInfo = async () => {
    setLoading(true);
    try {
      // Replace this with actual API call to fetch exam info
      const exams = [
        { id: 1, subject: 'Mathematics', date: '2023-12-15', board: 'AQA', teacher: 'Mr. Smith' },
        { id: 2, subject: 'English Literature', date: '2023-12-20', board: 'Edexcel', teacher: 'Ms. Johnson' },
      ];
      setExamInfo(exams);
    } catch (error) {
      console.error('Error fetching exam info:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(() => {
    fetchExamInfo();
  });

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
    if (selectedExams().length === 0) {
      alert('Please select at least one exam.');
      return;
    }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      await fetch('/api/savePreferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedExams: selectedExams().map((exam) => exam.id),
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

        <h2 class="text-2xl font-semibold mb-4">Select Your Exams</h2>
        <Show when={!loading()} fallback={<p>Loading exams...</p>}>
          <For each={examInfo()}>
            {(exam) => (
              <div class="flex items-center mb-2">
                <input
                  type="checkbox"
                  id={`exam-${exam.id}`}
                  class="cursor-pointer mr-2"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedExams([...selectedExams(), exam]);
                    } else {
                      setSelectedExams(selectedExams().filter((ex) => ex.id !== exam.id));
                    }
                  }}
                />
                <label for={`exam-${exam.id}`} class="cursor-pointer">
                  {`${exam.subject} - ${exam.board} - ${exam.date} - Teacher: ${exam.teacher}`}
                </label>
              </div>
            )}
          </For>
        </Show>

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