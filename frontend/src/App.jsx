import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Stack,
  Container,
  Select,
  Heading,
  Flex,
  Button,
} from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import TeamTable from "./components/tables/TeamTable";
import PlayerStatsTable from "./components/tables/PlayerStatsTable";
import CreatePlayerModal from "./components/modals/CreatePlayerModal";
import CreateSchedule from "./components/modals/CreateSchedule";
import ScheduleSection from "./components/sections/ScheduleSection";
import MatchesSection from "./components/sections/MatchesSection";
import CreateMatchModal from "./components/modals/CreateMatchModal";
import { formatDate } from "./utils/formatDate"
import PrivateRoute from "./routes/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./components/admin/AdminDashboard";
import VODReviewPage from './pages/VODReviewPage';
import NotFound from "./pages/NotFound";
import Footer from "./components/sections/Footer";
import PricingPage from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import AboutUsPage from "./pages/AboutUs";
import Contact from "./pages/Contact";
import {
  fetchPlayerById,
  fetchPlayers,
  deletePlayerById
} from './services/playerService';

import {
  deleteScheduleById,
  fetchSchedules
} from './services/scheduleService';

import {
  deleteMatchById,
  createMatch
} from './services/matchService';

export const API_URL = import.meta.env.VITE_API_URL || "/";




function App() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState([]);
  const [showCreateMatchModal, setShowCreateMatchModal] = useState(false);
  const [userRole, setUserRole] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    console.log(`Logged in user - Token: ${token}, Role: ${role}`);
    setUserRole(role || ""); 

    const loadPlayers = async () => {
      const data = await fetchPlayers();
      setPlayers(data);
      setIsLoading(false);
    };

    loadPlayers();
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      setIsLoading(true); // Set loading state to true at the start
      try {
        const data = await fetchSchedules();
        setSchedules(
          data.map((schedule) => ({
            ...schedule,
            match_date: formatDate(schedule.match_date),
          }))
        );
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setIsLoading(false); // Ensure loading state is false after the operation
      }
    };
  
    loadSchedules();
  }, []);
  

  const handlePlayerChange = async (event) => {
    const playerId = event.target.value;
    if (playerId) {
      try {
        const player = await fetchPlayerById(playerId);
        console.log("Fetched player data:", player);
        setSelectedPlayer(player);
      } catch (error) {
        console.error("Error fetching player:", error);
      }
    } else {
      setSelectedPlayer(null);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      await deleteMatchById(matchId);
      if (selectedPlayer) {
        const player = await fetchPlayerById(selectedPlayer.id);
        setSelectedPlayer(player);
      }
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    try {
      await deleteScheduleById(scheduleId);
      const updatedSchedules = schedules.filter(
        (schedule) => schedule.id !== scheduleId
      );
      setSchedules(updatedSchedules);
    } catch (error) {
      console.error("Error deleting schedule:", error);
    }
  };

  const updatePlayerList = async () => {
    const updatedPlayers = await fetchPlayers();
    setPlayers(updatedPlayers);
  };

  return (
    <ChakraProvider>
      <Router>
        <Stack minH="100vh" direction="column">
          <Navbar userRole={userRole}/>
          <Container maxW="1900px" my={4} flex={1}>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/admin"
                element={
                  <PrivateRoute allowedRoles={["admin", "master_admin"]}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
              <Route path="/vod-review" element={<VODReviewPage userRole={userRole}/>} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute allowedRoles={["user", "admin", "master_admin"]}>
                    <Dashboard
                      players={players}
                      selectedPlayer={selectedPlayer}
                      isLoading={isLoading}
                      userRole={userRole}
                      schedules={schedules}
                      handleDeleteMatch={handleDeleteMatch}
                      handleDeleteSchedule={handleDeleteSchedule}
                      updatePlayerList={updatePlayerList}
                      handlePlayerChange={handlePlayerChange}
                      API_URL={API_URL}
                    />
                  </PrivateRoute>
                }
              />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/not-found" element={<NotFound />}/>
            </Routes>
          </Container>
          <Footer />
        </Stack>
      </Router>
    </ChakraProvider>
  );
}

export default App;

