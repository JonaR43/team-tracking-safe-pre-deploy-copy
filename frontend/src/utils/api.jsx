// utils/api.js

export const fetchPlayerById = async (id) => {
  const response = await fetch(`${API_URL}/players/${id}`);
  return response.json();
};

export const updatePlayerStats = async (id, stats) => {
  const response = await fetch(`${API_URL}/players/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stats }),
  });
  return response.json();
};

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

