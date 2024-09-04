// services/playerService.js
const API_URL = import.meta.env.VITE_API_URL;

export const fetchPlayerById = async (id) => {
    const response = await fetch(`${API_URL}/players/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch player data");
    }
    return response.json();
    };

export const fetchPlayers = async () => {
    try {
      const response = await fetch(`${API_URL}/players`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.log("Error fetching players:", error);
      return [];
    }
  };
  
  export const deletePlayerById = async (id, updatePlayerList) => {
    try {
      const response = await fetch(`${API_URL}/delete_player/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete player");
      }
  
      updatePlayerList();
    } catch (error) {
      console.error("Error deleting player:", error);
    }
  };
  
  export const updatePlayerStats = async (id, stats) => {
    const response = await fetch(`${API_URL}/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stats }),
    });
    return response.json();
  };
  