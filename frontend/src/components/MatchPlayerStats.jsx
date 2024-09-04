import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  Stack,
  FormLabel,
  FormControl,
} from '@chakra-ui/react';

const MatchPlayerStats = ({ isOpen, onClose, match, players }) => {
  const [stats, setStats] = useState({
    player_id: '',
    kills: 0,
    deaths: 0,
    assists: 0,
    damage_output: 0,
    objective_time: 0,
    plants: 0,
    defuses: 0,
    first_blood: 0,
    first_death: 0,
    captures: 0,
  });

  const [gameMode, setGameMode] = useState('');

  useEffect(() => {
    if (match) {
      setGameMode(match.game_mode);
    }
  }, [match]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats((prevStats) => ({
      ...prevStats,
      [name]: value,
    }));
  };

  const handlePlayerChange = (e) => {
    setStats((prevStats) => ({
      ...prevStats,
      player_id: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create_player_match_stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: match.id,
          player_id: stats.player_id,
          kills: stats.kills,
          deaths: stats.deaths,
          assists: stats.assists,
          damage_output: stats.damage_output,
          objective_time: stats.objective_time,
          plants: stats.plants,
          defuses: stats.defuses,
          first_blood: stats.first_blood,
          first_death: stats.first_death,
          captures: stats.captures,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to update stats');
      }
      const updatedStats = await response.json();
      console.log('Stats updated:', updatedStats);
      onClose();
    } catch (error) {
      console.error('Error updating stats:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Player Stats</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Select Player</FormLabel>
              <Select
                placeholder="Select player"
                value={stats.player_id}
                onChange={handlePlayerChange}
              >
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Kills</FormLabel>
              <Input
                type="number"
                name="kills"
                value={stats.kills}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Deaths</FormLabel>
              <Input
                type="number"
                name="deaths"
                value={stats.deaths}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Assists</FormLabel>
              <Input
                type="number"
                name="assists"
                value={stats.assists}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Damage Output</FormLabel>
              <Input
                type="number"
                name="damage_output"
                value={stats.damage_output}
                onChange={handleChange}
              />
            </FormControl>

            {/* Conditionally render fields based on the game mode */}
            {gameMode === 'hardpoint' && (
              <FormControl>
                <FormLabel>Objective Time</FormLabel>
                <Input
                  type="number"
                  name="objective_time"
                  value={stats.objective_time}
                  onChange={handleChange}
                />
              </FormControl>
            )}
            {gameMode === 'search' && (
              <>
                <FormControl>
                  <FormLabel>Plants</FormLabel>
                  <Input
                    type="number"
                    name="plants"
                    value={stats.plants}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Defuses</FormLabel>
                  <Input
                    type="number"
                    name="defuses"
                    value={stats.defuses}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>First Blood</FormLabel>
                  <Input
                    type="number"
                    name="first_blood"
                    value={stats.first_blood}
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>First Death</FormLabel>
                  <Input
                    type="number"
                    name="first_death"
                    value={stats.first_death}
                    onChange={handleChange}
                  />
                </FormControl>
              </>
            )}
            {gameMode === 'control' && (
              <FormControl>
                <FormLabel>Captures</FormLabel>
                <Input
                  type="number"
                  name="captures"
                  value={stats.captures}
                  onChange={handleChange}
                />
              </FormControl>
            )}
          </Stack>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
            Save
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MatchPlayerStats;




