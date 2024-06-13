import { useEffect, useState } from "react";
import AnnouncementModal from "./AnnouncementModal.jsx";
import axios from "axios";
import Announcement from "./Announcement.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../../styles/Announcements.css";
import { Box, Container, IconButton, Input } from "@chakra-ui/react";
import { BiSortUp, BiSortDown } from "react-icons/bi";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { userDetails } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    filterAnnouncements(value);
  };

  const filterAnnouncements = (query) => {
    if (!query) {
      fetchAnnouncements(); // Fetch all announcements if the search query is empty
    } else {
      const filteredAnnouncements = announcements.filter((announcement) =>
        announcement.announcementTitle.toLowerCase().includes(query),
      );
      setAnnouncements(filteredAnnouncements);
    }
  };

  useEffect(() => {
    fetchAnnouncements(); // Call this function on component mount
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const announcementsResponse = await axios.get(
        "https://localhost:7141/api/v1/Announc",
      );
      const token = localStorage.getItem("authToken"); // Retrieve the token from local storage

      const announcementsWithUser = await Promise.all(
        announcementsResponse.data.announcements.map(async (announcement) => {
          const userResponse = await axios.get(
            `https://localhost:7141/api/v1/Authentication/userinfo/${announcement.createdBy}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the request
              },
            },
          );
          return { ...announcement, userName: userResponse.data.name };
        }),
      );

      setAnnouncements(announcementsWithUser);
      console.log(announcementsWithUser);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleCreateAnnouncement = async (formData) => {
    const token = localStorage.getItem("authToken");
    console.log(formData);
    try {
      const response = await axios.post(
        "https://localhost:7141/api/v1/Announc",
        formData, // Directly use FormData object received from the modal
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        console.log("Announcement created successfully");
        // Optionally, refresh the announcements list to include the new announcement
        fetchAnnouncements();
      } else {
        console.error(
          "Failed to create announcement:",
          response.data.validationsErrors,
        );
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
    handleCloseModal();
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      const response = await fetch(
        `https://localhost:7141/api/v1/Announc/${announcementId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete the announcement");
      }

      setAnnouncements(
        announcements.filter(
          (announcement) => announcement.announcementId !== announcementId,
        ),
      );
      console.log("Announcement deleted successfully");
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };
  const handleSort = () => {
    setIsSortedAsc(!isSortedAsc); // Toggle the sort order
    setAnnouncements((currentAnnouncements) =>
      [...currentAnnouncements].sort((a, b) => {
        const titleA = a.announcementTitle.toLowerCase();
        const titleB = b.announcementTitle.toLowerCase();
        if (titleA < titleB) return isSortedAsc ? -1 : 1;
        if (titleA > titleB) return isSortedAsc ? 1 : -1;
        return 0;
      }),
    );
  };
  return (
    <Container
      display="flex"
      flexDirection="column"
      minWidth="80vw"
      overflow="hidden"
      p="2rem"
      mt="1rem"
      borderRadius="12px"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="sm"
      position="relative"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={6}
      >
        <Box
          as="h1"
          fontSize="3xl"
          fontWeight="extrabold"
          position="sticky"
          top={0}
          zIndex={1}
          py={4}
        >
          Announcements
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            aria-label="Sort Announcements"
            icon={isSortedAsc ? <BiSortUp /> : <BiSortDown />}
            onClick={handleSort}
            mr={4}
            colorScheme="blue"
          />
          <Input
            size="md"
            placeholder="Search Announcements"
            onChange={handleSearchChange}
            mr={4}
            borderColor="blue.500"
          />
          <IconButton
            aria-label="Add Announcement"
            icon={<AddIcon />}
            onClick={handleOpenModal}
            colorScheme="blue"
          />
        </Box>
      </Box>
      <Box overflowY="auto" maxH="70vh" p={4} borderRadius="md" boxShadow="md">
        {Array.isArray(announcements) && announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Announcement
              key={announcement.announcementId}
              title={announcement.announcementTitle}
              content={announcement.announcementDescription}
              date={new Date(announcement.announcementDate).toLocaleString(
                "en-UK",
              )}
              username={announcement.userName}
              currentUserId={userDetails.id}
              announcementUserId={announcement.createdBy}
              announcementId={announcement.announcementId}
              imageUrl={announcement.imageUrl}
              onDelete={() =>
                handleDeleteAnnouncement(announcement.announcementId)
              }
            />
          ))
        ) : (
          <Box textAlign="center" mt={8} color="gray.500">
            No announcements found.
          </Box>
        )}
      </Box>

      <AnnouncementModal
        open={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateAnnouncement}
      />
    </Container>
  );
};

export default AnnouncementList;
