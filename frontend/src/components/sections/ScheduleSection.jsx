import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button, IconButton } from '@chakra-ui/react';
import { AiOutlineDelete } from 'react-icons/ai';
import { formatDate } from '../../utils/formatDate';
import ScheduleMatchesModal from '../modals/ScheduleMatchesModal'; // Import the new modal component

const ScheduleSection = ({ schedules, isLoading, onDeleteSchedule, userRole }) => {
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      onDeleteSchedule(id);
      // Refresh the page
      window.location.reload();
    }
  };

  const handleShowMatches = (id) => {
    setSelectedScheduleId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedScheduleId(null);
  };

  return (
    <>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Team ID</Th>
            <Th>Opponent</Th>
            <Th>Date</Th>
            <Th>Best Of</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {schedules.map(schedule => (
            <Tr key={schedule.id}>
              <Td>{schedule.team_id}</Td>
              <Td>{schedule.opponent}</Td>
              <Td>{formatDate(schedule.match_date)}</Td>
              <Td>{schedule.best_of}</Td>
              <Td>
                <Button colorScheme="blue" mr={3} onClick={() => handleShowMatches(schedule.id)}>
                  Match Details
                </Button>
                {(userRole === 'admin' || userRole === 'master_admin') && (
                  <IconButton
                    colorScheme="red"
                    aria-label="Delete schedule"
                    icon={<AiOutlineDelete />}
                    onClick={() => handleDelete(schedule.id)}
                  />
                )}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Schedule Matches Modal */}
      {selectedScheduleId && (
        <ScheduleMatchesModal
          isOpen={isModalOpen}
          onClose={closeModal}
          scheduleId={selectedScheduleId}
        />
      )}
    </>
  );
};

export default ScheduleSection;

