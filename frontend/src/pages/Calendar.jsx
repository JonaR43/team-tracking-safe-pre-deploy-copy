import React, { useEffect, useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { fetchSchedules } from '../services/scheduleService'; // Adjust the path if needed
import ScheduleMatchesModal from '../components/modals/ScheduleMatchesModal'; // Import the modal component

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedules = await fetchSchedules();
        const calendarEvents = schedules.map((schedule) => {
          const matchDate = new Date(schedule.match_date);
          return {
            id: schedule.id, // Add this line to keep track of the schedule ID
            title: `Opponent: ${schedule.opponent} | Best of: ${schedule.best_of}`,
            start: matchDate,
            end: matchDate, // Adjust this if you have specific end times
            allDay: true,
          };
        });
        setEvents(calendarEvents);
      } catch (error) {
        console.error('Error fetching schedules:', error);
      }
    };

    fetchData();
  }, []);

  const handleEventClick = (event) => {
    setSelectedScheduleId(event.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScheduleId(null);
  };

  return (
    <div style={{ height: '100vh', padding: '1rem' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleEventClick} // Handle event clicks
      />

      {/* Schedule Matches Modal */}
      {selectedScheduleId && (
        <ScheduleMatchesModal
          isOpen={isModalOpen}
          onClose={closeModal}
          scheduleId={selectedScheduleId}
        />
      )}
    </div>
  );
};

export default CalendarPage;







