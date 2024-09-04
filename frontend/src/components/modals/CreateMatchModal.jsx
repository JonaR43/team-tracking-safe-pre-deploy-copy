// CreateMatchModal.jsx
import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, FormControl, FormLabel, Input, Select, useToast } from '@chakra-ui/react';

const CreateMatchModal = ({ isOpen, onClose, handleSubmit }) => {
    const [gameMode, setGameMode] = useState('');
    const [formData, setFormData] = useState({
        result: '',
        match_type: '',
        date: '',
        map: '',
        team_id: '',
        schedule_id: '',
        // Hardpoint-specific fields
        our_score: '',
        enemy_score: '',
        white_hill_time: '',
        contested_time: '',
        rotations_won: '',
        rotations_lost: '',
        breaking_hills: '',
        break_hold: '',
        rotate_hold: '',
        break_lose: '',
        rotate_lose: '',
        // Search and Destroy-specific fields
        total_rounds: '',
        rounds_won: '',
        rounds_lost: '',
        offense_rounds_won: '',
        offense_rounds_lost: '',
        defense_rounds_won: '',
        defense_rounds_lost: '',
        first_bloods: '',
        first_deaths: '',
        plants: '',
        defuses: '',
        // Control-specific fields
        captures: '',
        breaks: '',
        ticks: '',
        total_rounds_control: '',
        rounds_won_control: '',
        rounds_lost_control: '',
        offense_rounds_won_control: '',
        offense_rounds_lost_control: '',
        defense_rounds_won_control: '',
        defense_rounds_lost_control: '',
        team_wipe: '',
        error_team_wipe: '',
    });

    const toast = useToast();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleGameModeChange = (e) => {
        const value = e.target.value;
        setGameMode(value);
        setFormData(prevData => ({ ...prevData, game_mode: value }));
    };

    const handleFormSubmit = async () => {
        try {
            await handleSubmit(formData);
            toast({
                title: "Match created.",
                description: "The match has been successfully created.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            // Reset form values
            resetForm();
            onClose();
            // Refresh the page
            window.location.reload();
        } catch (error) {
            toast({
                title: "Error creating match.",
                description: error.response?.data?.error || "An error occurred while creating the match.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const resetForm = () => {
        setFormData({
            result: '',
            match_type: '',
            date: '',
            map: '',
            team_id: '',
            schedule_id: '',
            // Hardpoint-specific fields
            our_score: '',
            enemy_score: '',
            white_hill_time: '',
            contested_time: '',
            rotations_won: '',
            rotations_lost: '',
            breaking_hills: '',
            break_hold: '',
            rotate_hold: '',
            break_lose: '',
            rotate_lose: '',
            // Search and Destroy-specific fields
            total_rounds: '',
            rounds_won: '',
            rounds_lost: '',
            offense_rounds_won: '',
            offense_rounds_lost: '',
            defense_rounds_won: '',
            defense_rounds_lost: '',
            first_bloods: '',
            first_deaths: '',
            plants: '',
            defuses: '',
            // Control-specific fields
            captures: '',
            breaks: '',
            ticks: '',
            total_rounds_control: '',
            rounds_won_control: '',
            rounds_lost_control: '',
            offense_rounds_won_control: '',
            offense_rounds_lost_control: '',
            defense_rounds_won_control: '',
            defense_rounds_lost_control: '',
            team_wipe: '',
            error_team_wipe: '',
        });
        setGameMode('');
    };

    const handleClose = () => {
        // Reset form values when closing
        resetForm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Create Match</ModalHeader>
                <ModalBody>
                    <FormControl mb={4}>
                        <FormLabel>Result</FormLabel>
                        <Select name="result" value={formData.result} onChange={handleChange}>
                            <option value="">Select Result</option>
                            <option value="Win">Win</option>
                            <option value="Loss">Loss</option>
                        </Select>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Match Type</FormLabel>
                        <Select name="match_type" value={formData.match_type} onChange={handleChange}>
                            <option value="">Select Match Type</option>
                            <option value="Scrim">Scrim</option>
                            <option value="League">League</option>
                            <option value="Tournament">Tournament</option>
                        </Select>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Date</FormLabel>
                        <Input name="date" type="date" value={formData.date} onChange={handleChange} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Map</FormLabel>
                        <Input name="map" value={formData.map} onChange={handleChange} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Game Mode</FormLabel>
                        <Select name="game_mode" value={gameMode} onChange={handleGameModeChange}>
                            <option value="">Select Game Mode</option>
                            <option value="hardpoint">Hardpoint</option>
                            <option value="search">Search and Destroy</option>
                            <option value="control">Control</option>
                        </Select>
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Team ID</FormLabel>
                        <Input name="team_id" type="number" value={formData.team_id} onChange={handleChange} />
                    </FormControl>
                    <FormControl mb={4}>
                        <FormLabel>Schedule ID (optional)</FormLabel>
                        <Input name="schedule_id" type="number" value={formData.schedule_id} onChange={handleChange} />
                    </FormControl>

                    {/* Conditional Rendering of Game Mode Specific Fields */}
                    {gameMode === 'hardpoint' && (
                        <>
                            {/* Hardpoint fields */}
                            <FormControl mb={4}>
                                <FormLabel>Our Score</FormLabel>
                                <Input name="our_score" type="number" value={formData.our_score} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Enemy Score</FormLabel>
                                <Input name="enemy_score" type="number" value={formData.enemy_score} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>White Hill Time</FormLabel>
                                <Input name="white_hill_time" type="number" value={formData.white_hill_time} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Contested Time</FormLabel>
                                <Input name="contested_time" type="number" value={formData.contested_time} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rotations Won</FormLabel>
                                <Input name="rotations_won" type="number" value={formData.rotations_won} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rotations Lost</FormLabel>
                                <Input name="rotations_lost" type="number" value={formData.rotations_lost} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Breaking Hills</FormLabel>
                                <Input name="breaking_hills" type="number" value={formData.breaking_hills} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Break Hold</FormLabel>
                                <Input name="break_hold" type="number" value={formData.break_hold} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rotate Hold</FormLabel>
                                <Input name="rotate_hold" type="number" value={formData.rotate_hold} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Break Lose</FormLabel>
                                <Input name="break_lose" type="number" value={formData.break_lose} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rotate Lose</FormLabel>
                                <Input name="rotate_lose" type="number" value={formData.rotate_lose} onChange={handleChange} />
                            </FormControl>
                        </>
                    )}

                    {gameMode === 'search' && (
                        <>
                            {/* Search and Destroy fields */}
                            <FormControl mb={4}>
                                <FormLabel>Total Rounds</FormLabel>
                                <Input name="total_rounds" type="number" value={formData.total_rounds} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rounds Won</FormLabel>
                                <Input name="rounds_won" type="number" value={formData.rounds_won} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rounds Lost</FormLabel>
                                <Input name="rounds_lost" type="number" value={formData.rounds_lost} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Offense Rounds Won</FormLabel>
                                <Input name="offense_rounds_won" type="number" value={formData.offense_rounds_won} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Offense Rounds Lost</FormLabel>
                                <Input name="offense_rounds_lost" type="number" value={formData.offense_rounds_lost} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Defense Rounds Won</FormLabel>
                                <Input name="defense_rounds_won" type="number" value={formData.defense_rounds_won} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Defense Rounds Lost</FormLabel>
                                <Input name="defense_rounds_lost" type="number" value={formData.defense_rounds_lost} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>First Bloods</FormLabel>
                                <Input name="first_bloods" type="number" value={formData.first_bloods} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>First Deaths</FormLabel>
                                <Input name="first_deaths" type="number" value={formData.first_deaths} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Plants</FormLabel>
                                <Input name="plants" type="number" value={formData.plants} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Defuses</FormLabel>
                                <Input name="defuses" type="number" value={formData.defuses} onChange={handleChange} />
                            </FormControl>
                        </>
                    )}

                    {gameMode === 'control' && (
                        <>
                            {/* Control fields */}
                            <FormControl mb={4}>
                                <FormLabel>Captures</FormLabel>
                                <Input name="captures" type="number" value={formData.captures} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Breaks</FormLabel>
                                <Input name="breaks" type="number" value={formData.breaks} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Ticks</FormLabel>
                                <Input name="ticks" type="number" value={formData.ticks} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Total Rounds</FormLabel>
                                <Input name="total_rounds_control" type="number" value={formData.total_rounds_control} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rounds Won</FormLabel>
                                <Input name="rounds_won_control" type="number" value={formData.rounds_won_control} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Rounds Lost</FormLabel>
                                <Input name="rounds_lost_control" type="number" value={formData.rounds_lost_control} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Offense Rounds Won</FormLabel>
                                <Input name="offense_rounds_won_control" type="number" value={formData.offense_rounds_won_control} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Offense Rounds Lost</FormLabel>
                                <Input name="offense_rounds_lost_control" type="number" value={formData.offense_rounds_lost_control} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Defense Rounds Won</FormLabel>
                                <Input name="defense_rounds_won_control" type="number" value={formData.defense_rounds_won_control} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Defense Rounds Lost</FormLabel>
                                <Input name="defense_rounds_lost_control" type="number" value={formData.defense_rounds_lost_control} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Team Wipe</FormLabel>
                                <Input name="team_wipe" type="number" value={formData.team_wipe} onChange={handleChange} />
                            </FormControl>
                            <FormControl mb={4}>
                                <FormLabel>Error Team Wipe</FormLabel>
                                <Input name="error_team_wipe" type="number" value={formData.error_team_wipe} onChange={handleChange} />
                            </FormControl>
                        </>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleFormSubmit}>Create Match</Button>
                    <Button ml={3} onClick={handleClose}>Cancel</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CreateMatchModal;





