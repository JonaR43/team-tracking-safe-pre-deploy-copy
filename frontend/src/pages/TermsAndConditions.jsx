// pages/TermsAndConditions.js
import React from 'react';
import { Box, Container, Heading, Text } from '@chakra-ui/react';

const TermsAndConditions = () => {
  return (
    <Container maxW="container.md" py={8}>
      <Heading as="h1" mb={4}>Terms and Conditions</Heading>
      <Text mb={4}>
        Welcome to [Your Company Name]! These terms and conditions outline the rules and regulations for the use of [Your Company Name]'s website, located at [Your Website URL].
      </Text>
      <Text mb={4}>
        By accessing this website we assume you accept these terms and conditions. Do not continue to use [Your Company Name] if you do not agree to take all of the terms and conditions stated on this page.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>1. License</Heading>
      <Text mb={4}>
        Unless otherwise stated, [Your Company Name] and/or its licensors own the intellectual property rights for all material on [Your Company Name]. All intellectual property rights are reserved. You may access this from [Your Company Name] for your own personal use subjected to restrictions set in these terms and conditions.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>2. User Content</Heading>
      <Text mb={4}>
        You must not:
        <ul>
          <li>Republish material from [Your Company Name]</li>
          <li>Sell, rent or sub-license material from [Your Company Name]</li>
          <li>Reproduce, duplicate or copy material from [Your Company Name]</li>
          <li>Redistribute content from [Your Company Name]</li>
        </ul>
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>3. Disclaimer</Heading>
      <Text mb={4}>
        All the information on this website is published in good faith and for general information purpose only. [Your Company Name] does not make any warranties about the completeness, reliability and accuracy of this information.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>4. Limitation of Liability</Heading>
      <Text mb={4}>
        In no event shall [Your Company Name] be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
      </Text>
      <Heading as="h2" size="lg" mt={6} mb={4}>5. Changes</Heading>
      <Text mb={4}>
        We may update our Terms and Conditions from time to time. We will notify you of any changes by posting the new Terms and Conditions on this page. You are advised to review this Terms and Conditions periodically for any changes.
      </Text>
      <Text>
        If you have any questions about these Terms and Conditions, please contact us.
      </Text>
    </Container>
  );
};

export default TermsAndConditions;
