import React from 'react';
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, TableContainer, useColorModeValue } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

const TeamTable = ({ data, onDeletePlayer, userRole }) => {
  const headerBgColor = useColorModeValue('gray.200', 'gray.600');
  const tableBgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box p={5} borderRadius="md" overflow="hidden" boxShadow="md">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>ID</Th>
              { (userRole === "admin" || userRole === "master_admin") && (
                <Th>Actions</Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {data.map((member) => (
              <Tr key={member.id}>
                <Td>{member.name}</Td>
                <Td>{member.role}</Td>
                <Td>{member.id}</Td>
                { (userRole === "admin" || userRole === "master_admin") && (
                  <Td>
                    <Button
                      onClick={() => onDeletePlayer(member.id)}
                      size="sm"
                      colorScheme="red"
                    >
                      <DeleteIcon />
                    </Button>
                  </Td>
                )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamTable;



