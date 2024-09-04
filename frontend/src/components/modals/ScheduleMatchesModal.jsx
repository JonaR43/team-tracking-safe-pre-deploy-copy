// components/ScheduleMatchesModal.js
import React, { useState, useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,ModalFooter, Table, Thead, Tbody, Tr, Th, Td, Button, Spinner } from '@chakra-ui/react';
import MatchStatsModal from './MatchStatsModal'; // Import the MatchStatsModal component

const ScheduleMatchesModal = ({ isOpen, onClose, scheduleId }) => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null); // State for the selected match
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false); // State for the Match Stats Modal

  useEffect(() => {
    const fetchMatches = async () => {
      if (!scheduleId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://127.0.0.1:5000/schedule/${scheduleId}/matches`);
        if (!response.ok) {
          throw new Error('Failed to fetch matches');
        }
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error('Error fetching matches:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [scheduleId]);

  const handleShowMatchDetails = (match) => {
    setSelectedMatch(match);
    setIsStatsModalOpen(true);
  };

  const closeStatsModal = () => {
    setIsStatsModalOpen(false);
    setSelectedMatch(null);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent maxW="1200px">
          <ModalHeader>Matches for Schedule {scheduleId}</ModalHeader>
          <ModalBody>
            {loading && <Spinner size="lg" />}
            {error && <div>Error: {error}</div>}
            {!loading && !error && (
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
                  {matches.length > 0 ? (
                    matches.map(match => (
                      <Tr key={match.id}>
                        <Td>{match.id}</Td>
                        <Td>{match.date}</Td>
                        <Td>{match.result}</Td>
                        <Td>{match.match_type}</Td>
                        <Td>{match.map}</Td>
                        <Td>{match.game_mode}</Td>
                        <Td>{match.team_id}</Td>
                        <Td>
                          <Button size="sm" onClick={() => handleShowMatchDetails(match)}>
                            Show Match Details
                          </Button>
                        </Td>
                      </Tr>
                    ))
                  ) : (
                    <Tr>
                      <Td colSpan={8}>No matches found</Td>
                    </Tr>
                  )}
                </Tbody>
              </Table>
            )}
          </ModalBody>
          <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchStatsModal
          isOpen={isStatsModalOpen}
          onClose={closeStatsModal}
          match={selectedMatch}
        />
      )}
    </>
  );
};

export default ScheduleMatchesModal;



