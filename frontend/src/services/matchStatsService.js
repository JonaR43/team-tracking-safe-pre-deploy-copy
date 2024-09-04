const API_URL = import.meta.env.VITE_API_URL;

export const createMatchStats = async (stats) => {
    await fetch(`${API_URL}/match-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    });
  };
  
  export const updateMatchStats = async (stats) => {
    await fetch(`${API_URL}/match-stats/${stats.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stats),
    });
  };
  
  export const deleteMatchStats = async (id) => {
    await fetch(`${API_URL}/match-stats/${id}`, { method: 'DELETE' });
  };