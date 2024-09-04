import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Select, Text, Flex, Alert, AlertIcon, Textarea, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";

const VODReviewPage = ({userRole}) => {
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/embed/default'); // Default video URL
  const [directUrl, setDirectUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [schedule, setSchedule] = useState('');
  const [match, setMatch] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [videoLinks, setVideoLinks] = useState([]);
  const [error, setError] = useState(null);
  const [playerStats, setPlayerStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedulesResponse = await fetch('http://127.0.0.1:5000/schedules');
        if (!schedulesResponse.ok) throw new Error(`HTTP error! status: ${schedulesResponse.status}`);
        const schedulesData = await schedulesResponse.json();
        setSchedules(schedulesData);

        const matchesResponse = await fetch('http://127.0.0.1:5000/matches');
        if (!matchesResponse.ok) throw new Error(`HTTP error! status: ${matchesResponse.status}`);
        const matchesData = await matchesResponse.json();
        setMatches(matchesData);

        const videoLinksResponse = await fetch('http://127.0.0.1:5000/api/video-links');
        if (!videoLinksResponse.ok) throw new Error(`HTTP error! status: ${videoLinksResponse.status}`);
        const videoLinksData = await videoLinksResponse.json();
        setVideoLinks(videoLinksData);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (schedule) {
      setFilteredMatches(matches.filter(mch => mch.schedule_id === parseInt(schedule)));
    } else {
      setFilteredMatches([]);
    }
  }, [schedule, matches]);

  useEffect(() => {
    if (match) {
      const selected = matches.find(mch => mch.id === parseInt(match));
      setSelectedMatch(selected);

      // Fetch player stats for the selected match
      const fetchPlayerStats = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:5000/matches/${match}/player_stats`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          setPlayerStats(data);
        } catch (error) {
          setError(error.message);
        }
      };

      fetchPlayerStats();
    } else {
      setSelectedMatch(null);
      setPlayerStats([]);
    }
  }, [match, matches]);

  const extractVideoIdFromUrl = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|watch\?.*?v=|.*\/videos\/)?([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setDirectUrl(url);
    const videoId = extractVideoIdFromUrl(url);
    setVideoUrl(videoId ? `https://www.youtube.com/embed/${videoId}` : 'https://www.youtube.com/embed/default');
  };

  const handleSaveVideoLink = async () => {
    if (!match) {
      alert('Please select a match to save the video link');
      return;
    }

    try {
      const videoLinkData = {
        videoUrl: videoUrl,
        schedule: schedule,
        match: match,
        notes: notes,
      };

      const saveResponse = await fetch('http://127.0.0.1:5000/api/save-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(videoLinkData),
      });

      if (!saveResponse.ok) throw new Error('Failed to save video link');

      const savedLink = await saveResponse.json();
      setVideoLinks([...videoLinks, savedLink]);
      alert('Video link saved successfully!');
      setNotes('');
      setSchedule('');
      setMatch('');
      setDirectUrl('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleLoadVideo = async () => {
    if (!match) {
      alert('Please select a match to load the video');
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/matches/${match}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (data.video_url) {
        setVideoUrl(data.video_url);
      } else {
        alert('Selected match does not have a valid video URL');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteVideoLink = async (linkId) => {
    try {
      const deleteResponse = await fetch(`http://127.0.0.1:5000/api/video-links/${linkId}`, {
        method: 'DELETE',
      });

      if (!deleteResponse.ok) throw new Error('Failed to delete video link');

      setVideoLinks(videoLinks.filter(link => link.id !== linkId));
      alert('Video link deleted successfully!');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" p={4}>
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Flex w="100%" mb={4}>
        <Box flex="1" mr={4}>
          <iframe
            width="100%"
            height="480"
            src={videoUrl}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>

        <Box flex="1" display="flex" flexDirection="column">
          <Box mb={4}>
            <Select placeholder="Select Schedule" value={schedule} onChange={(e) => setSchedule(e.target.value)}>
              {schedules.map((sched) => (
                <option key={sched.id} value={sched.id}>
                  {sched.opponent} - {sched.match_date}
                </option>
              ))}
            </Select>
          </Box>
          <Box mb={4}>
            <Select placeholder="Select Match" value={match} onChange={(e) => setMatch(e.target.value)}>
              {filteredMatches.map((mch) => (
                <option key={mch.id} value={mch.id}>
                  {mch.date} - {mch.map} - {mch.game_mode}
                </option>
              ))}
            </Select>
          </Box>
          <Flex mb={4}>
            <Button onClick={handleLoadVideo} mr={4}>Load Video</Button>
            { (userRole === "admin" || userRole === "master_admin") && (
            <Button colorScheme="red" onClick={() => handleDeleteVideoLink(videoLinks.find(link => link.match_id === selectedMatch?.id)?.id)}>
              Delete Video Link and Notes
            </Button>
            )}
          </Flex>

          <Box>
            <Input
              placeholder="Enter YouTube video URL"
              value={directUrl}
              onChange={handleUrlChange}
              mb={4}
            />
            <Textarea
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              mb={4}
            />
            <Button onClick={handleSaveVideoLink}>Save Video Link</Button>
          </Box>
        </Box>
      </Flex>

      {/* Removed additional dropdowns */}
      
      {/* Preview section for selected schedule and match */}
      <Box w="100%" mt={4}>
        {schedule && (
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Schedule: {schedules.find(sched => sched.id === parseInt(schedule))?.opponent} - {schedules.find(sched => sched.id === parseInt(schedule))?.match_date}
          </Text>
        )}
        {match && (
          <Text fontSize="lg" fontWeight="bold" mb={2}>
            Match: {filteredMatches.find(mch => mch.id === parseInt(match))?.date} - {filteredMatches.find(mch => mch.id === parseInt(match))?.map} - {filteredMatches.find(mch => mch.id === parseInt(match))?.game_mode}
          </Text>
        )}
      </Box>

      {selectedMatch && (
        <Flex w="100%" mt={4}>
          <Box flex="1" mr={4}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Match ID</Th>
                  <Th>Date</Th>
                  <Th>Map</Th>
                  <Th>Game Mode</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{selectedMatch.id}</Td>
                  <Td>{selectedMatch.date}</Td>
                  <Td>{selectedMatch.map}</Td>
                  <Td>{selectedMatch.game_mode}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>

          <Box flex="1" display="flex" flexDirection="column">
            <Box mb={4}>
              {videoLinks
                .filter(link => link.match_id === selectedMatch.id)
                .map(link => (
                  <Box key={link.id} mb={4}>
                    <Text fontWeight="bold">Notes:</Text>
                    <Text>{link.notes}</Text>
                  </Box>
                ))}
            </Box>

            <Box>
              <Text fontSize="lg" fontWeight="bold" mb={2}>
                Player Stats
              </Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Player Name</Th>
                    <Th>Kills</Th>
                    <Th>Deaths</Th>
                    <Th>Assists</Th>
                    <Th>Objective Time</Th>
                    <Th>KDA</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {playerStats.map(player => (
                    <Tr key={player.id}>
                      <Td>{player.player_name}</Td>
                      <Td>{player.kills}</Td>
                      <Td>{player.deaths}</Td>
                      <Td>{player.assists}</Td>
                      <Td>{player.objective_time}</Td>
                      <Td>{player.kda}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Flex>
      )}
    </Box>
  );
};

export default VODReviewPage;












