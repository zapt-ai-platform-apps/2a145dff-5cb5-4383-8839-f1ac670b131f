import { createSignal, For } from 'solid-js';
import dayjs from 'dayjs';
import { createDraggable } from '@neodrag/solid';

function Calendar(props) {
  const [currentMonth, setCurrentMonth] = createSignal(dayjs());
  const { draggable } = createDraggable();

  const daysInMonth = () => {
    const startDay = currentMonth().startOf('month').startOf('week');
    const endDay = currentMonth().endOf('month').endOf('week');
    let date = startDay.clone().subtract(1, 'day');
    const days = [];
    while (date.isBefore(endDay, 'day')) {
      date = date.add(1, 'day');
      days.push(date.clone());
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(currentMonth().add(1, 'month'));
  };

  const prevMonth = () => {
    setCurrentMonth(currentMonth().subtract(1, 'month'));
  };

  const sessionsForDay = (day) => {
    return props.timetable.filter(
      (session) => dayjs(session.date).isSame(day, 'day')
    );
  };

  return (
    <div class="h-full">
      <div class="flex justify-between items-center mb-4">
        <button
          onClick={prevMonth}
          class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          Previous
        </button>
        <h2 class="text-2xl font-bold text-purple-600">
          {currentMonth().format('MMMM YYYY')}
        </h2>
        <button
          onClick={nextMonth}
          class="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          Next
        </button>
      </div>
      <div class="grid grid-cols-7 gap-2">
        <For each={['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']}>
          {(day) => (
            <div class="text-center font-semibold text-purple-600">{day}</div>
          )}
        </For>
        <For each={daysInMonth()}>
          {(day) => (
            <div class="border rounded-lg h-32 p-1">
              <div class="text-right">
                <span class="text-sm">{day.format('D')}</span>
              </div>
              <For each={sessionsForDay(day)}>
                {(session) => (
                  <div
                    class="bg-white shadow-md rounded-lg p-1 mb-1 cursor-pointer"
                    use:draggable={{
                      onDragEnd: (data) => {
                        const newDate = prompt('Enter new date (YYYY-MM-DD):');
                        const newTime = prompt('Enter new time (morning/afternoon):');
                        if (newDate && newTime) {
                          props.onRescheduleSession(session.id, newDate, newTime);
                        }
                      },
                    }}
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-xs font-semibold text-purple-600">
                          {session.subject}
                        </p>
                        <p class="text-xs">{session.topic}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={session.completed}
                        onChange={(e) =>
                          props.onMarkSession(session.id, e.target.checked)
                        }
                        class="cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

export default Calendar;