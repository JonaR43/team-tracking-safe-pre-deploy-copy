import React, { useEffect, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Box,
  Heading,
} from '@chakra-ui/react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://127.0.0.1:5000/admin/users', {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUsers(data);
          } else {
            console.error('Failed to fetch users');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
      setIsLoading(false);
    };

    const fetchTeams = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/teams');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          console.error('Failed to fetch teams');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchUsers();
    fetchTeams();
  }, []);

  const handleResetPassword = async (username) => {
    const newPassword = prompt('Enter new password');
    if (newPassword) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:5000/admin/reset_password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ username, new_password: newPassword }),
        });
        if (response.ok) {
          alert('Password reset successful');
        } else {
          alert('Failed to reset password');
        }
      } catch (error) {
        console.error('Error resetting password:', error);
      }
    }
  };

  const handleDeleteUser = async (username) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete user ${username}?`);
    if (confirmDelete) {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://127.0.0.1:5000/admin/delete_user', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ username }),
        });
        if (response.ok) {
          alert('User deleted successfully');
          setUsers(users.filter(user => user.username !== username));
        } else {
          alert('Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleMakeAdmin = async (username) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:5000/admin/mark_as_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        alert('User marked as admin');
        setUsers(users.map(user => user.username === username ? { ...user, role: 'admin' } : user));
      } else {
        alert('Failed to mark user as admin');
      }
    } catch (error) {
      console.error('Error marking user as admin:', error);
    }
  };

  const handleMakeUser = async (username) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:5000/admin/mark_as_user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });
      if (response.ok) {
        alert('User marked as user');
        setUsers(users.map(user => user.username === username ? { ...user, role: 'user' } : user));
      } else {
        alert('Failed to mark user as user');
      }
    } catch (error) {
      console.error('Error marking user as user:', error);
    }
  };

  const handleCreateTeam = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://127.0.0.1:5000/create_team', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: teamName }),
      });
      if (response.ok) {
        const newTeam = await response.json();
        setTeams([...teams, newTeam]);
        setTeamName('');
        alert('Team created successfully');
      } else {
        alert('Failed to create team');
      }
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleDeleteTeam = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete team ${id}?`);
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:5000/delete_team/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Team deleted successfully');
          setTeams(teams.filter(team => team.id !== id));
        } else {
          alert('Failed to delete team');
        }
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  return (
    <div>
      <Heading mb={4}>Admin Dashboard</Heading>
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <Heading size="md" mb={2}>Users</Heading>
          <Table variant="simple" mb={4}>
            <Thead>
              <Tr>
                <Th>Username</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map(user => (
                <Tr key={user.username}>
                  <Td>{user.username}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <Button onClick={() => handleResetPassword(user.username)} colorScheme="blue" mr={2}>
                      Reset Password
                    </Button>
                    {user.role !== 'admin' && (
                      <Button onClick={() => handleMakeAdmin(user.username)} colorScheme="green" mr={2}>
                        Make Admin
                      </Button>
                    )}
                    {user.role !== 'user' && (
                      <Button onClick={() => handleMakeUser(user.username)} colorScheme="yellow" mr={2}>
                        Make User
                      </Button>
                    )}
                    <Button onClick={() => handleDeleteUser(user.username)} colorScheme="red">
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Heading size="md" mb={2}>Teams</Heading>
          <Table variant="simple" mb={4}>
            <Thead>
              <Tr>
                <Th>Team ID</Th>
                <Th>Team Name</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {teams.map(team => (
                <Tr key={team.id}>
                  <Td>{team.id}</Td>
                  <Td>{team.name}</Td>
                  <Td>
                    <Button onClick={() => handleDeleteTeam(team.id)} colorScheme="red">
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Box mb={4}>
            <Input
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              mb={2}
            />
            <Button onClick={handleCreateTeam} colorScheme="green">Create Team</Button>
          </Box>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;






