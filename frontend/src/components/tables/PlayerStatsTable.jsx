import React from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { deleteMatchStatsByPlayerId, fetchPlayerById } from '../../services/playerService';

const PlayerStatsTable = ({ playerData, matchStats, userRole, selectedPlayer, setSelectedPlayer }) => {
  // Hooks should be called unconditionally
  const headerBgColor = useColorModeValue('gray.200', 'gray.600');
  const tableBgColor = useColorModeValue('white', 'gray.800');

  const handleDeleteMatchStats = async (matchId, playerId) => {
    try {
      // Call the new API route to delete match stats for a specific player
      await deleteMatchStatsByPlayerId(matchId, playerId);
    
      // Refetch the player data to update the UI if needed
      if (selectedPlayer && selectedPlayer.id === playerId) {
        const updatedPlayer = await fetchPlayerById(selectedPlayer.id);
        setSelectedPlayer(updatedPlayer); // Update the state with the refetched player
      }
    } catch (error) {
      console.error("Error deleting player's match stats:", error);
    }
  };

  // Return early if no data
  if (!playerData || !Array.isArray(matchStats) || matchStats.length === 0) {
    return <div>No data available</div>;
  }

  // Create a map of match IDs to player stats for quick lookup
  const playerMatchStatsMap = React.useMemo(() => {
    return playerData.match_stats.reduce((map, stat) => {
      map[stat.match_id] = stat;
      return map;
    }, {});
  }, [playerData.match_stats]);

  return (
    <Box>
      {/* Player Stats Table */}
      <Box p={4} bg={headerBgColor} borderRadius="md" mb={4}>
        <h2>Player Stats</h2>
      </Box>
      <Box
        bg={tableBgColor}
        borderRadius="md"
        border="1px"
        borderColor={useColorModeValue('gray.300', 'gray.600')}
      >
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Stat</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(playerData).map(([key, value], index) => (
                key !== 'match_stats' && (
                  <Tr key={index}>
                    <Td>{key}</Td>
                    <Td>{value}</Td>
                  </Tr>
                )
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>

      {/* Match History Table */}
      <Box mt={6}>
        <Box p={4} bg={headerBgColor} borderRadius="md" mb={4}>
          <h2>Match History</h2>
        </Box>
        <Box
          bg={tableBgColor}
          borderRadius="md"
          overflowY="auto"
          maxH="400px" // Adjust this height as needed
          border="1px"
          borderColor={useColorModeValue('gray.300', 'gray.600')}
        >
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>Date</Th>
                  <Th>Result</Th>
                  <Th>Match Type</Th>
                  <Th>Map</Th>
                  <Th>Game Mode</Th>
                  <Th>Kills</Th>
                  <Th>Deaths</Th>
                  <Th>Assists</Th>
                  {(userRole === "admin" || userRole === "master_admin") && <Th>Actions</Th>}
                </Tr>
              </Thead>
              <Tbody>
                {matchStats.map((matchStat, index) => {
                  const playerStats = playerMatchStatsMap[matchStat.id] || {};
                  return (
                    <Tr key={index}>
                      <Td>{matchStat.id}</Td>
                      <Td>{matchStat.date}</Td>
                      <Td>{matchStat.result}</Td>
                      <Td>{matchStat.match_type}</Td>
                      <Td>{matchStat.map}</Td>
                      <Td>{matchStat.game_mode}</Td>
                      <Td>{playerStats.kills || 0}</Td>
                      <Td>{playerStats.deaths || 0}</Td>
                      <Td>{playerStats.assists || 0}</Td>
                      {(userRole === "admin" || userRole === "master_admin") && (
                        <Td>
                          <Button
                            onClick={() => handleDeleteMatchStats(matchStat.id, playerData.id)}
                            size="sm"
                            colorScheme="red"
                          >
                            <DeleteIcon />
                          </Button>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerStatsTable;











