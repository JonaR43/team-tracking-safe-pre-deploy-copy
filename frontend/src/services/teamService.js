export const API_URL = import.meta.env.VITE_API_URL || "/";

export const fetchTeams = async () => {
    const response = await fetch(`${API_URL}/teams`);
    return response.json();
  };
  
  export const createTeam = async (team) => {
    await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team),
    });
  };
  
  export const deleteTeam = async (id) => {
    await fetch(`${API_URL}/teams/${id}`, { method: 'DELETE' });
  };