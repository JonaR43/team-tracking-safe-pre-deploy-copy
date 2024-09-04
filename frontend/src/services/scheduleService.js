// services/scheduleService.js
export const API_URL = import.meta.env.VITE_API_URL || "/";

export const fetchSchedules = async () => {
    const response = await fetch(`${API_URL}/schedules`);
    return response.json();
  };
  
  export const createSchedule = async (schedule) => {
    await fetch(`${API_URL}/schedules`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(schedule),
    });
  };
  
  export const deleteSchedule = async (id) => {
    await fetch(`${API_URL}/schedules/${id}`, { method: 'DELETE' });
  };

  export const deleteScheduleById = async (scheduleId) => {
    try {
      const response = await fetch(`${API_URL}/delete_schedule/${scheduleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Schedule deleted:", data);
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };
  