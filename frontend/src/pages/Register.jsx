// src/components/Register.js
import React, { useState } from 'react';
import { Box, Button, Input, Stack, Text, useToast, Heading } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      toast({
        title: 'Registration Successful',
        description: 'You are now registered.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/'); // Redirect to login page after registration
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Registration Failed',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Stack spacing={4} maxWidth="400px" mx="auto">
        <Heading size="lg" as="span" bgGradient="linear(to-r, cyan.400, blue.500)" bgClip="text">
          Register
        </Heading>
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleSubmit} colorScheme="blue">Register</Button>
        {error && <Text color="red.500">{error}</Text>}
      </Stack>
    </Box>
  );
};

export default Register;





