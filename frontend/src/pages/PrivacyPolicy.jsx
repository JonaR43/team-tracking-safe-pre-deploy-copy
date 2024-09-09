// pages/PrivacyPolicy.js
import React from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

const PrivacyPolicy = () => {
  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" mb={4}>Privacy Policy</Heading>
      <Text mb={4}>
        At [Your Company Name], accessible from [Your Website URL], one of our main priorities is the privacy of our visitors. This Privacy Policy explains how we handle information about you.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>1. Information We Do Not Collect</Heading>
      <Text mb={4}>
        We do not collect personal data such as names, email addresses, or any other identifying information from visitors to our website.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>2. Cookies</Heading>
      <Text mb={4}>
        We do not use cookies or any other tracking technologies that collect data about your browsing activities.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>3. Third-Party Links</Heading>
      <Text mb={4}>
        Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these third-party sites. We encourage you to review the privacy policies of any third-party sites you visit.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>4. Changes to This Privacy Policy</Heading>
      <Text mb={4}>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any changes.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>5. Contact Us</Heading>
      <Text mb={4}>
        If you have any questions about this Privacy Policy, please contact us at [Your Contact Information].
      </Text>
    </Container>
  );
};

export default PrivacyPolicy;
