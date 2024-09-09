// pages/AboutUsPage.js
import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Stack,
  useColorModeValue,
  Image
} from '@chakra-ui/react';

const AboutUsPage = () => {
  return (
    <Container maxW="container.xl" py={12}>
      <Heading textAlign="center" mb={8}>About Us</Heading>
      <Stack spacing={8}>
        <Box bg={useColorModeValue('gray.100', 'gray.700')} p={6} borderRadius="md">
          <Heading size="lg" mb={4}>Our Mission</Heading>
          <Text fontSize="lg">
            Our mission is to provide the best service possible to our customers. We strive to deliver exceptional quality and value through innovation, dedication, and continuous improvement.
          </Text>
        </Box>
        <Box bg={useColorModeValue('gray.100', 'gray.700')} p={6} borderRadius="md">
          <Heading size="lg" mb={4}>Our Vision</Heading>
          <Text fontSize="lg">
            Our vision is to be a global leader in our industry, known for our commitment to excellence and customer satisfaction. We aim to set new standards and drive positive change through our work.
          </Text>
        </Box>
        <Box bg={useColorModeValue('gray.100', 'gray.700')} p={6} borderRadius="md">
          <Heading size="lg" mb={4}>Meet the Team</Heading>
          <Stack spacing={6}>
            <Box>
              <Image src="/path/to/team-member1.jpg" alt="Team Member 1" borderRadius="full" boxSize="100px" mb={4} />
              <Heading size="md">John Doe</Heading>
              <Text fontSize="lg">CEO & Founder</Text>
              <Text>
                John has over 20 years of experience in the industry and is passionate about driving innovation and delivering exceptional results.
              </Text>
            </Box>
            <Box>
              <Image src="/path/to/team-member2.jpg" alt="Team Member 2" borderRadius="full" boxSize="100px" mb={4} />
              <Heading size="md">Jane Smith</Heading>
              <Text fontSize="lg">Chief Technology Officer</Text>
              <Text>
                Jane is an expert in technology and oversees the development and implementation of our innovative solutions.
              </Text>
            </Box>
            {/* Add more team members as needed */}
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default AboutUsPage;
