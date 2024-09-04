import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';
import { BiAddToQueue } from 'react-icons/bi';
import React, { useState } from 'react';

const CreatePlayerModal = ({ API_URL, onAddPlayer }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [teamId, setTeamId] = useState('');

    // Handle form submission
    const handleAddPlayer = async () => {
        const newPlayer = { name, role, team_id: parseInt(teamId) };
        
        try {
            const response = await fetch(`${API_URL}/create_player`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPlayer),
            });

            if (!response.ok) {
                throw new Error('Failed to add player');
            }

            // Refresh player list in parent component
            onAddPlayer();
            // Reset form fields
            setName('');
            setRole('');
            setTeamId('');
            // Close the modal
            onClose();
        } catch (error) {
            console.error('Error adding player:', error);
        }
    };

    // Handle modal close
    const handleClose = () => {
        // Reset form fields
        setName('');
        setRole('');
        setTeamId('');
        // Close the modal
        onClose();
    };

    return (
        <>
            <Button alignItems={"center"} gap={2} onClick={onOpen}>
                Add New Player
                <BiAddToQueue size={20} />
            </Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>New Player</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Flex alignItems={"center"} gap={"4"}>
                            <FormControl>
                                <FormLabel>Name</FormLabel>
                                <Input 
                                    placeholder='John Doe'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>
                        </Flex>
                        <FormControl>
                            <FormLabel>Role</FormLabel>
                            <Input 
                                placeholder='Flex'
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Team ID</FormLabel>
                            <Input 
                                placeholder='1'
                                type='number'
                                value={teamId}
                                onChange={(e) => setTeamId(e.target.value)}
                            />
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={handleAddPlayer}>Add</Button>
                        <Button onClick={handleClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePlayerModal;



