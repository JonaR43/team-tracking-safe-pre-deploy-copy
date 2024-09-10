// services/playerMatchStatsService.js
export const API_URL = import.meta.env.VITE_API_URL || "/";

export const createOrUpdatePlayerMatchStats = async (matchId, stats) => {
    try {
      const response = await fetch(`${API_URL}/create_or_update_player_match_stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: matchId,
          player_id: stats.player_id,
          kills: stats.kills,
          deaths: stats.deaths,
          assists: stats.assists,
          damage_output: stats.damage_output,
          objective_time: stats.objective_time,
          plants: stats.plants,
          defuses: stats.defuses,
          first_blood: stats.first_blood,
          first_death: stats.first_death,
          captures: stats.captures,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update stats');
      }
  
      return await response.json();  // Return the updated stats
    } catch (error) {
      console.error('Error updating stats:', error);
      throw error;  // Re-throw the error so it can be handled by the caller
    }
  };
  