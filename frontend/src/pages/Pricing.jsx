// PricingPage.js
import React from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  List,
  ListItem,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';

const PricingBox = ({ title, price, features }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={6}
      bg={useColorModeValue("white", "gray.800")}
      boxShadow="md"
      textAlign="center"
      width={{ base: "100%", sm: "80%", md: "30%" }}
    >
      <Heading size="md" mb={4}>{title}</Heading>
      <Text fontSize="2xl" mb={4}>{price}</Text>
      <List spacing={3} mb={6}>
        {features.map((feature, index) => (
          <ListItem key={index}>{feature}</ListItem>
        ))}
      </List>
      <Button colorScheme="blue">Get Started</Button>
    </Box>
  );
};

const PricingPage = () => {
  const pricingOptions = [
    {
      title: "Basic",
      price: "$10/month",
      features: ["Feature 1", "Feature 2", "Feature 3"],
    },
    {
      title: "Pro",
      price: "$25/month",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
    },
    {
      title: "Enterprise",
      price: "$50/month",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"],
    },
  ];

  return (
    <Container maxW="container.xl" py={12}>
      <Heading textAlign="center" mb={12}>Pricing Plans</Heading>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        justify="center"
        wrap="wrap"
        gap={8}
      >
        {pricingOptions.map((option, index) => (
          <PricingBox
            key={index}
            title={option.title}
            price={option.price}
            features={option.features}
          />
        ))}
      </Flex>
    </Container>
  );
};

export default PricingPage;

