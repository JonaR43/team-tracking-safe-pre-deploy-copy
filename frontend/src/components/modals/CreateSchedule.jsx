import React, { useState } from 'react';
import { 
  Button, Flex, FormControl, FormLabel, Input, 
  Modal, ModalBody, ModalCloseButton, ModalContent, 
  ModalFooter, ModalHeader, ModalOverlay, useDisclosure 
} from '@chakra-ui/react';
import { BiAddToQueue } from 'react-icons/bi';

const CreateSchedule = ({ apiUrl }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [teamId, setTeamId] = useState('');
  const [opponent, setOpponent] = useState('');
  const [date, setDate] = useState('');
  const [bestOf, setBestOf] = useState('');
  const [error, setError] = useState(null);

  const resetForm = () => {
    setTeamId('');
    setOpponent('');
    setDate('');
    setBestOf('');
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${apiUrl}/create_schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team_id: teamId,
          match_date: date,
          opponent: opponent,
          best_of: bestOf,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Schedule created:', data);
      handleClose(); // Reset form and close modal
      // Refresh the page
      window.location.reload();
    } catch (error) {
      console.error('Error creating schedule:', error);
      setError(error.message);
    }
  };

  return (
    <>
      <Button alignItems={"center"} gap={2} onClick={onOpen}>
        Add New Schedule
        <BiAddToQueue size={20} />
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>New Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Flex alignItems={"center"} gap={"4"}>
              <FormControl>
                <FormLabel>Team ID</FormLabel>
                <Input 
                  placeholder='Enter Team ID' 
                  value={teamId}
                  onChange={(e) => setTeamId(e.target.value)}
                />
              </FormControl>
            </Flex>
            <Flex alignItems={"center"} gap={"4"}>
              <FormControl>
                <FormLabel>Opponent</FormLabel>
                <Input 
                  placeholder='Ex eSports' 
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                />
              </FormControl>
            </Flex>
            <FormControl>
              <FormLabel>Date and Time</FormLabel>
              <Input 
                type='datetime-local'
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Best Of</FormLabel>
              <Input 
                placeholder='3' 
                value={bestOf}
                onChange={(e) => setBestOf(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
              Add
            </Button>
            <Button onClick={handleClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {error && <div>Error: {error}</div>}
    </>
  );
};

export default CreateSchedule;



