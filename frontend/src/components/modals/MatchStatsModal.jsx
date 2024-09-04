import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const MatchStatsModal = ({ isOpen, onClose, match }) => {
  const renderStatsTable = () => {
    const gameMode = match.game_mode;

    if (gameMode === 'hardpoint') {
      return (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Metric</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr><Td>Our Score</Td><Td>{match.our_score}</Td></Tr>
            <Tr><Td>Enemy Score</Td><Td>{match.enemy_score}</Td></Tr>
            <Tr><Td>White Hill Time</Td><Td>{match.white_hill_time}</Td></Tr>
            <Tr><Td>Contested Time</Td><Td>{match.contested_time}</Td></Tr>
            <Tr><Td>Rotations Won</Td><Td>{match.rotations_won}</Td></Tr>
            <Tr><Td>Rotations Lost</Td><Td>{match.rotations_lost}</Td></Tr>
            <Tr><Td>Breaking Hills</Td><Td>{match.breaking_hills}</Td></Tr>
            <Tr><Td>Break Hold</Td><Td>{match.break_hold}</Td></Tr>
            <Tr><Td>Rotate Hold</Td><Td>{match.rotate_hold}</Td></Tr>
            <Tr><Td>Break Lose</Td><Td>{match.break_lose}</Td></Tr>
            <Tr><Td>Rotate Lose</Td><Td>{match.rotate_lose}</Td></Tr>
          </Tbody>
        </Table>
      );
    } else if (gameMode === 'search') {
      return (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Metric</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr><Td>Total Rounds</Td><Td>{match.total_rounds}</Td></Tr>
            <Tr><Td>Rounds Won</Td><Td>{match.rounds_won}</Td></Tr>
            <Tr><Td>Rounds Lost</Td><Td>{match.rounds_lost}</Td></Tr>
            <Tr><Td>Offense Rounds Won</Td><Td>{match.offense_rounds_won}</Td></Tr>
            <Tr><Td>Offense Rounds Lost</Td><Td>{match.offense_rounds_lost}</Td></Tr>
            <Tr><Td>Defense Rounds Won</Td><Td>{match.defense_rounds_won}</Td></Tr>
            <Tr><Td>Defense Rounds Lost</Td><Td>{match.defense_rounds_lost}</Td></Tr>
            <Tr><Td>First Bloods</Td><Td>{match.first_bloods}</Td></Tr>
            <Tr><Td>First Deaths</Td><Td>{match.first_deaths}</Td></Tr>
            <Tr><Td>Plants</Td><Td>{match.plants}</Td></Tr>
            <Tr><Td>Defuses</Td><Td>{match.defuses}</Td></Tr>
          </Tbody>
        </Table>
      );
    } else if (gameMode === 'control') {
      return (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Metric</Th>
              <Th>Value</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr><Td>Captures</Td><Td>{match.captures}</Td></Tr>
            <Tr><Td>Breaks</Td><Td>{match.breaks}</Td></Tr>
            <Tr><Td>Ticks</Td><Td>{match.ticks}</Td></Tr>
            <Tr><Td>Total Rounds</Td><Td>{match.total_rounds_control}</Td></Tr>
            <Tr><Td>Rounds Won</Td><Td>{match.rounds_won_control}</Td></Tr>
            <Tr><Td>Rounds Lost</Td><Td>{match.rounds_lost_control}</Td></Tr>
            <Tr><Td>Offense Rounds Won</Td><Td>{match.offense_rounds_won_control}</Td></Tr>
            <Tr><Td>Offense Rounds Lost</Td><Td>{match.offense_rounds_lost_control}</Td></Tr>
            <Tr><Td>Defense Rounds Won</Td><Td>{match.defense_rounds_won_control}</Td></Tr>
            <Tr><Td>Defense Rounds Lost</Td><Td>{match.defense_rounds_lost_control}</Td></Tr>
            <Tr><Td>Team Wipe</Td><Td>{match.team_wipe}</Td></Tr>
            <Tr><Td>Error Team Wipe</Td><Td>{match.error_team_wipe}</Td></Tr>
          </Tbody>
        </Table>
      );
    }
    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Match Stats</ModalHeader>
        <ModalBody>
          {renderStatsTable()}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchStatsModal;

