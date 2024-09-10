import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const Contact = () => {
  return (
    <Container maxW="container.xl" py={8}>
      <Box bg={useColorModeValue("gray.100", "gray.700")} p={8} borderRadius="md" boxShadow="md">
        <Heading as="h1" mb={4}>Contact Us</Heading>
        <Text mb={6}>
          If you have any questions, please fill out the form below and we’ll get back to you as soon as possible.
        </Text>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeT0UvyujdloF3zV4T4Om0vflW4o7crx2Et5vMvZ9zXqG7Htw/viewform?embedded=true"
          width="100%"
          height="700"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Contact Form"
          style={{ border: 'none' }}
        >
          Loading…
        </iframe>
      </Box>
    </Container>
  );
};

export default Contact;
