// Navbar.js
import React from "react";
import { Box, Button, Container, useColorMode, useColorModeValue, Flex, Text } from "@chakra-ui/react";
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu";
import { useLocation, useNavigate, Link } from 'react-router-dom';

const Navbar = ({ userRole }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage = location.pathname === '/' || location.pathname === '/register';
  const isAdminDashboard = location.pathname === '/admin';
  const isRegularDashboard = location.pathname === '/dashboard';
  const isVodReviewPage = location.pathname === '/vod-review';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <Container maxW={"1900px"}>
      <Box px={4} my={4} borderRadius={5} bg={useColorModeValue("gray.200", "gray.700")}>
        <Flex h="16" alignItems={"center"} justifyContent={"space-between"}>
          <Flex alignItems={"center"} justifyContent={"space-between"} gap={3} display={{ base: "none", sm: "flex" }}>
            <img src="/assets/cod.png" alt="Eclipse logo" width={50} height={50} />
            <Text fontSize={"40px"}>Eclipse</Text>
          </Flex>
          <Flex gap={3} alignItems={"center"}>
            <Text fontSize={"lg"} fontWeight={"500"} display={{ base: "none", md: "block" }}>
              Powered by J.Customs 🔥
            </Text>
            <Button onClick={toggleColorMode}>
              {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
            </Button>
            {!isLoginPage && (
              <>
                {userRole === 'admin' || userRole === 'master_admin' ? (
                  <>
                    {isAdminDashboard || isVodReviewPage ? (
                      <Button as={Link} to="/dashboard" colorScheme="blue">
                        Regular Dashboard
                      </Button>
                    ) : (
                      <Button as={Link} to="/admin" colorScheme="blue">
                        Admin Dashboard
                      </Button>
                    )}
                    <Button as={Link} to="/vod-review" colorScheme="teal">
                      VOD Review
                    </Button>
                    <Button onClick={handleLogout} colorScheme="red">
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button as={Link} to="/dashboard" colorScheme="blue">
                      Dashboard
                    </Button>
                    <Button as={Link} to="/vod-review" colorScheme="teal">
                      VOD Review
                    </Button>
                    <Button onClick={handleLogout} colorScheme="red">
                      Logout
                    </Button>
                  </>
                )}
              </>
            )}
          </Flex>
        </Flex>
      </Box>
    </Container>
  );
};

export default Navbar;










