// services/matchService.js
const API_URL = import.meta.env.VITE_API_URL;

export const fetchMatches = async () => {
    const response = await fetch(`${API_URL}/matches`);
    return response.json();
  };
  
  export const createMatch = async (matchData) => {
    const response = await fetch(`${API_URL}/create_match`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchData),
    });
  
    if (!response.ok) {
      throw new Error("Failed to create match");
    }
  
    return response.json(); // Optionally return the response data if needed
  };
  
  export const updateMatch = async (match) => {
    await fetch(`${API_URL}/matches/${match.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match),
    });
  };
  
  export const deleteMatch = async (id) => {
    await fetch(`${API_URL}/matches/${id}`, { method: 'DELETE' });
  };
  
export const deleteMatchById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/delete_match_stats/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete match");
    }

    console.log("Match deleted successfully");
  } catch (error) {
    console.error("Error deleting match:", error);
  }
};
