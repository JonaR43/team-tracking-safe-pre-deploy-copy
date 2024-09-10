import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Input,
  Textarea,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const Footer = () => {
  const [formData, setFormData] = useState({ name: '', email: '', question: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbz_7ppiTQFRzDjMuuXFDxLrbcZvOjbQEUzgwvHw9QQCpQmrSyr32XOItewbFb4rko91/exec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const result = await response.json();
      if (result.result === 'success') {
        setMessage('Thank you for your submission!');
        setFormData({ name: '', email: '', question: '' });
      } else {
        setMessage('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  

  return (
    <Box as="footer" bg={useColorModeValue("gray.800", "gray.900")} color="white" py={4} mt={8}>
      <Container maxW="container.xl">
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="flex-start"
          gap={8}
        >
          <Box flex={1}>
            <Heading size="md" mb={4}>Quick Links</Heading>
            <Flex direction="column" gap={2}>
              <a href="/about-us"><Text>About Us</Text></a>
              <a href="/pricing"><Text>Pricing</Text></a>
              <a href="/contact"><Text>Contact</Text></a>
              <a href="/terms-and-conditions"><Text>Terms and Conditions</Text></a>
              <a href="/privacy-policy"><Text>Privacy Policy</Text></a>
            </Flex>
          </Box>

          <Box flex={2}>
            <Heading size="md" mb={4}>Contact Us</Heading>
            <form onSubmit={handleSubmit}>
              <Input
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                mb={4}
              />
              <Input
                placeholder="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                mb={4}
              />
              <Textarea
                placeholder="Your question or message"
                name="question"
                value={formData.question}
                onChange={handleChange}
                mb={4}
              />
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </form>
            {message && <Text mt={4}>{message}</Text>}
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;




