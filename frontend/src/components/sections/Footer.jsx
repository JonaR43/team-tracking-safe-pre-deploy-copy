import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

const Footer = () => {
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
            <Flex
              direction="row"
              wrap="wrap"
              gap={6}
              justify={{ base: 'center', md: 'flex-start' }}
            >
              <a href="/about-us"><Text>About Us</Text></a>
              <a href="/pricing"><Text>Pricing</Text></a>
              <a href="/contact"><Text>Contact</Text></a>
              <a href="/terms-and-conditions"><Text>Terms and Conditions</Text></a>
              <a href="/privacy-policy"><Text>Privacy Policy</Text></a>
            </Flex>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;







