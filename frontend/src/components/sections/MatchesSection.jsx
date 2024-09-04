import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Stack,
  Heading,
  Button,
  Icon,
  Spinner,
  Alert,
  AlertIcon
} from '@chakra-ui/react';
import { FaTrash, FaEdit, FaUserEdit } from 'react-icons/fa';
import MatchStatsModal from '../modals/MatchStatsModal';
import MatchPlayerStats from '../MatchPlayerStats';

const MatchesSection = ({ apiUrl, userRole }) => {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isMatchStatsModalOpen, setIsMatchStatsModalOpen] = useState(false);
  const [isUpdateStatsModalOpen, setIsUpdateStatsModalOpen] = useState(false);
  const [isPlayerStatsModalOpen, setIsPlayerStatsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiUrl}/matches`);
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        setError('Error fetching matches: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchPlayers = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${apiUrl}/players`);
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const data = await response.json();
        setPlayers(data);
      } catch (error) {
        setError('Error fetching players: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
    fetchPlayers();
  }, [apiUrl]);

  const handleShowStats = async (matchId) => {
    try {
      const response = await fetch(`${apiUrl}/match/${matchId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch match details');
      }
      const data = await response.json();
      setSelectedMatch(data);
      setIsMatchStatsModalOpen(true);
    } catch (error) {
      setError('Error fetching match details: ' + error.message);
    }
  };

  const handleUpdateStats = (matchId, gameMode) => {
    setSelectedMatch({ id: matchId, game_mode: gameMode });
    setIsUpdateStatsModalOpen(true);
  };

  const handleShowPlayerStats = (matchId, gameMode) => {
    setSelectedMatch({ id: matchId, game_mode: gameMode });
    setIsPlayerStatsModalOpen(true);
  };

  const handleDeleteMatch = async (matchId) => {
    if (window.confirm('Are you sure you want to delete this match?')) {
      try {
        const response = await fetch(`${apiUrl}/delete_match/${matchId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete match');
        }
        setMatches(matches.filter((match) => match.id !== matchId));
      } catch (error) {
        setError('Error deleting match: ' + error.message);
      }
    }
  };

  const closeMatchStatsModal = () => {
    setIsMatchStatsModalOpen(false);
    setSelectedMatch(null);
  };

  const closeUpdateStatsModal = () => {
    setIsUpdateStatsModalOpen(false);
    setSelectedMatch(null);
  };

  const closePlayerStatsModal = () => {
    setIsPlayerStatsModalOpen(false);
    setSelectedMatch(null);
  };

  return (
    <Stack spacing={4} mt={8}>
      <Heading size="lg" mb={4} as="span" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
        Matches
      </Heading>
      
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Date</Th>
              <Th>Result</Th>
              <Th>Match Type</Th>
              <Th>Map</Th>
              <Th>Game Mode</Th>
              <Th>Team ID</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {matches.map((match) => (
              <Tr key={match.id}>
                <Td>{match.id}</Td>
                <Td>{match.date}</Td>
                <Td>{match.result}</Td>
                <Td>{match.match_type}</Td>
                <Td>{match.map}</Td>
                <Td>{match.game_mode}</Td>
                <Td>{match.team_id}</Td>
                <Td>
                  <Button size="sm" onClick={() => handleShowStats(match.id)} mr={2}>Show Stats</Button>
                  {(userRole === 'admin' || userRole === 'master_admin') && (
                    <>
                      <Button size="sm" onClick={() => handleShowPlayerStats(match.id, match.game_mode)} mr={2}>
                        <Icon as={FaUserEdit} />
                      </Button>
                      <Button size="sm" colorScheme="red" onClick={() => handleDeleteMatch(match.id)}>
                        <Icon as={FaTrash} />
                      </Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      {selectedMatch && (
        <MatchStatsModal isOpen={isMatchStatsModalOpen} onClose={closeMatchStatsModal} match={selectedMatch} />
      )}

      {selectedMatch && (
        <MatchPlayerStats
          isOpen={isPlayerStatsModalOpen}
          onClose={closePlayerStatsModal}
          match={selectedMatch}
          players={players}
        />
      )}
    </Stack>
  );
};

export default MatchesSection;









