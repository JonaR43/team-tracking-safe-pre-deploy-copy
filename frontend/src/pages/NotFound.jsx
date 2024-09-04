// src/pages/NotFound.jsx
import React from "react";
import { Box, Heading, Text, Stack, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function NotFound() {
  return (
    <>
      <Stack
        justifyContent="center"
        alignItems="center"
        height="80vh"
        textAlign="center"
        spacing={4}
      >
        <Heading size="2xl">404</Heading>
        <Text fontSize="2xl">
          Oops! Page not found <span role="img" aria-label="sad emoji">😢</span>
        </Text>
        <Text fontSize="lg">
          It seems like the page you're looking for doesn't exist.
        </Text>
        <Box mt={6}>
          <Link to="/Dashboard">
            <Button colorScheme="teal">Go Dashboard</Button>
          </Link>
        </Box>
      </Stack>
    </>
  );
}

export default NotFound;
