import React, { useState } from 'react';
import { Box, Button, Input, Stack, Text, useToast, Heading } from '@chakra-ui/react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      const { token, role } = data; // Extract role from the response
  
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
  
      toast({
        title: 'Login Successful',
        description: 'You are now logged in.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      if (role === 'admin' || role === "master_admin") {
        navigate('/admin'); // Redirect to admin dashboard
      } else {
        navigate('/dashboard'); // Redirect to regular dashboard
      }
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Login Failed',
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
                      Login
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
        <Button onClick={handleSubmit} colorScheme="blue">Login</Button>
        {error && <Text color="red.500">{error}</Text>}
        <Button as={Link} to="/register" colorScheme="teal">Register</Button>
      </Stack>
    </Box>
  );
};

export default Login;







