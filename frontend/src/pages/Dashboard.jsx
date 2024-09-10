import React, { useState } from "react";
import {
  Stack,
  Heading,
  Flex,
  Button,
  Select
} from "@chakra-ui/react";
import TeamTable from "../components/tables/TeamTable";
import PlayerStatsTable from "../components/tables/PlayerStatsTable";
import ScheduleSection from "../components/sections/ScheduleSection";
import MatchesSection from "../components/sections/MatchesSection";
import CreatePlayerModal from "../components/modals/CreatePlayerModal";
import CreateSchedule from "../components/modals/CreateSchedule";
import CreateMatchModal from "../components/modals/CreateMatchModal";
import { createMatch } from '../services/matchService'; // Import the service function
import { fetchPlayerById } from '../services/playerService'; // Import the service function

function Dashboard({
  players,
  isLoading,
  userRole,
  schedules,
  handleDeleteSchedule,
  updatePlayerList,
  API_URL,
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);

  const handleCreateMatch = async (formData) => {
    try {
      await createMatch(formData); // Call the service function 
      console.log("Match created successfully");
      setShowCreateMatchModal(false);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  return (
    <Stack>
      <Heading
        size="lg"
        mb={4}
        as="span"
        bgGradient="linear(to-r, cyan.400, blue.500)"
        bgClip="text"
      >
        Team & Roster
      </Heading>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <TeamTable
          data={players}
          onDeletePlayer={(id) => deletePlayerById(id, updatePlayerList)}
          userRole={userRole}
        />
      )}
      {(userRole === "admin" || userRole === "master_admin") && (
        <Flex
          gap={3}
          alignItems="center"
          paddingTop={2}
          paddingBottom={6}
        >
          <CreatePlayerModal
            API_URL={API_URL}
            onAddPlayer={updatePlayerList}
          />
          <CreateSchedule apiUrl={API_URL} />
          <Button onClick={() => setShowCreateMatchModal(true)}>
            Create Match
          </Button>
        </Flex>
      )}
      <Heading
        size="lg"
        mb={4}
        as="span"
        bgGradient="linear(to-r, cyan.400, blue.500)"
        bgClip="text"
      >
        Schedule
      </Heading>
      <ScheduleSection
        schedules={schedules}
        isLoading={isLoading}
        onDeleteSchedule={handleDeleteSchedule}
        userRole={userRole}
      />
      <MatchesSection apiUrl={API_URL} userRole={userRole} />
      <Stack spacing={4} mt={8}>
        <Heading
          size="lg"
          mb={4}
          as="span"
          bgGradient="linear(to-r, cyan.400, blue.500)"
          bgClip="text"
        >
          Look up by Player
        </Heading>
        <Select
          placeholder="Select a player"
          onChange={async (e) => {
            const playerId = e.target.value;
            if (playerId) {
              try {
                const player = await fetchPlayerById(playerId);
                console.log("Fetched player data:", player);
                setSelectedPlayer(player);
              } catch (error) {
                console.error("Error fetching player:", error);
              }
            } else {
              setSelectedPlayer(null);
            }
          }}
        >
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </Select>
        {selectedPlayer && (
          <PlayerStatsTable
            playerData={selectedPlayer.player}
            matchStats={selectedPlayer.match_stats}
            userRole={userRole}
            selectedPlayer={selectedPlayer}
            setSelectedPlayer={setSelectedPlayer}
          />
        )}
      </Stack>
      <CreateMatchModal
        isOpen={showCreateMatchModal}
        onClose={() => setShowCreateMatchModal(false)}
        onCreateMatch={handleCreateMatch}
      />
    </Stack>
  );
}

export default Dashboard;







