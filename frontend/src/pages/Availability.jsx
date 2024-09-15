import React, { useState } from 'react';
import { Box, Flex, Table, Thead, Tbody, Tr, Th, Td, Text, VStack, useBreakpointValue } from '@chakra-ui/react';
import moment from 'moment';

// Helper function to get the start and end of the current week
const getWeekDays = () => {
  const startOfWeek = moment().startOf('week'); // Monday as the start of the week
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push(startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD'));
  }
  return days;
};

// Helper function to generate time slots
const generateTimeSlots = () => {
  const slots = [];
  let time = moment().startOf('day').add(8, 'hours'); // Start at 8 AM
  while (time.hour() < 20) { // End at 8 PM
    slots.push(time.format('HH:mm'));
    time = time.add(30, 'minutes'); // 30-minute intervals
  }
  return slots;
};

const Availability = () => {
  const [selectedCell, setSelectedCell] = useState(null); // State for selected cell
  const [schedule, setSchedule] = useState({}); // State for time slot data (date, time, player names, and colors)

  const weekDays = getWeekDays();
  const timeSlots = generateTimeSlots();
  const tableSize = useBreakpointValue({ base: 'sm', md: 'md', lg: 'lg' });

  const indexItems = [
    { label: 'Not Available', color: 'red.500' },
    { label: 'Open/Warmup', color: 'yellow.500' },
    { label: 'Break', color: 'blue.500' },
    { label: 'Scrims', color: 'green.500' },
    { label: 'Tournament', color: 'purple.500' },
    { label: 'VOD/Review', color: 'teal.500' },
    { label: 'Next Week', color: 'orange.500' },
    { label: 'Off days/VOD', color: 'gray.500' },
  ];

  // Handle color selection and fill time slots with player data
  const handleColorSelect = (color) => {
    if (selectedCell) {
      const { date, time } = selectedCell;

      // Update the entire schedule up to the selected time slot
      const newSchedule = { ...schedule };
      const playerName = 'Player 1'; // For demonstration, you can replace this with dynamic player data

      for (let i = 0; i < timeSlots.length; i++) {
        const currentTime = timeSlots[i];
        if (currentTime === time) break; // Stop when we reach the selected time

        weekDays.forEach((day) => {
          const key = `${day}-${currentTime}`;
          if (!newSchedule[key]) newSchedule[key] = { color: '', players: [] };
          newSchedule[key] = { color, players: [playerName] }; // Replace colors and players
        });
      }

      // Update the selected time slot with the selected color and player
      const selectedKey = `${date}-${time}`;
      newSchedule[selectedKey] = { color, players: [playerName] };

      setSchedule(newSchedule);
    }
  };

  // Handle cell click to set the selected cell
  const handleCellClick = (date, time) => {
    setSelectedCell({ date, time });
    console.log(`Selected cell: ${date} ${time}`); // Debugging: Log the selected cell
  };

  return (
    <Flex direction="row" p={4} gap={4}>
      {/* Index Box */}
      <Box flex="1" p={4} bg="gray.700" color="white" borderRadius="md" boxShadow="sm">
        <Text fontSize="lg" mb={2}>Index</Text>
        <VStack spacing={2} align="start">
          {indexItems.map((item) => (
            <Flex key={item.label} align="center" onClick={() => handleColorSelect(item.color)} cursor="pointer">
              <Box w={4} h={4} bg={item.color} borderRadius="md" mr={2} />
              <Text>{item.label}</Text>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Table with Days of the Week and Timetable */}
      <Box flex="2" p={4} bg="gray.700" color="white" borderRadius="md" boxShadow="sm">
        <Text fontSize="lg" mb={2}>Weekly Schedule</Text>
        <Table variant="simple" size={tableSize}>
          <Thead>
            <Tr>
              <Th bg="gray.600" color="white" borderColor="gray.800" borderRight="1px solid gray.800">
                Time
              </Th>
              {weekDays.map((date, index) => (
                <Th key={date} bg="gray.600" color="white" borderColor="gray.800" borderRight={index < weekDays.length - 1 ? '1px solid gray.800' : 'none'}>
                  {moment(date).format('dddd')}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {timeSlots.map((time) => (
              <Tr key={time}>
                <Td bg="gray.500" borderColor="gray.800" borderRight="1px solid gray.800">
                  {time}
                </Td>
                {weekDays.map((date, index) => {
                  const key = `${date}-${time}`;
                  const cellData = schedule[key] || {};
                  return (
                    <Td
                      key={key}
                      bg={cellData.color || 'gray.500'}
                      borderColor="gray.800"
                      borderRight={index < weekDays.length - 1 ? '1px solid gray.800' : 'none'}
                      onClick={() => handleCellClick(date, time)}
                      cursor="pointer"
                    >
                      {cellData.players?.join(', ') || ''}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Scheduled Matches */}
      <Box flex="1" p={4} bg="gray.700" color="white" borderRadius="md" boxShadow="sm">
        <Text fontSize="lg" mb={2}>Scheduled Matches</Text>
        <Table variant="simple" size={tableSize}>
          <Thead>
            <Tr>
              <Th bg="gray.600" color="white" borderColor="gray.800" borderRight="1px solid gray.800">
                Date
              </Th>
              <Th bg="gray.600" color="white" borderColor="gray.800" borderRight="1px solid gray.800">
                Opponent
              </Th>
              <Th bg="gray.600" color="white" borderColor="gray.800">
                Time
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td bg="gray.500" borderColor="gray.800" borderRight="1px solid gray.800">
                2024-09-15
              </Td>
              <Td bg="gray.500" borderColor="gray.800" borderRight="1px solid gray.800">
                Team A
              </Td>
              <Td bg="gray.500" borderColor="gray.800">
                14:00
              </Td>
            </Tr>
            <Tr>
              <Td bg="gray.500" borderColor="gray.800" borderRight="1px solid gray.800">
                2024-09-16
              </Td>
              <Td bg="gray.500" borderColor="gray.800" borderRight="1px solid gray.800">
                Team B
              </Td>
              <Td bg="gray.500" borderColor="gray.800">
                10:00
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Flex>
  );
};

export default Availability;














