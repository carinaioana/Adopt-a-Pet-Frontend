import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import IconButton from "@mui/material/IconButton";
import AnnouncementModal from "./AnnouncementModal.jsx";
import axios from "axios";
import Announcement from "./Announcement.jsx";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    filterAnnouncements(value);
  };

  const filterAnnouncements = (query) => {
    if (!query) {
      fetchAnnouncements(); // Fetch all announcements if the search query is empty
    } else {
      const filteredAnnouncements = announcements.filter(
        (announcement) =>
          announcement.announcementTitle
            .toLowerCase()
            .includes(query.toLowerCase()) ||
          announcement.announcementDescription
            .toLowerCase()
            .includes(query.toLowerCase()),
      );
      setAnnouncements(filteredAnnouncements);
    }
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.get(
          "https://localhost:7141/api/v1/Authentication/currentuserinfo",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        setCurrentUser(response.data); // Set the current user's information
      } catch (error) {
        console.error("Error fetching current user info:", error);
      }
    };
    console.log(currentUser);
    fetchCurrentUser();
  }, []);

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
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleCreateAnnouncement = async (newAnnouncement) => {
    const announcementWithDate = {
      ...newAnnouncement,
      announcementDate: new Date().toISOString(),
    };
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "https://localhost:7141/api/v1/Announc",
        announcementWithDate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.success) {
        console.log("Announcement created successfully");
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

    const handleUpdateAnnouncement = async (announcementId, updatedAnnouncement) => {
        const token = localStorage.getItem("authToken");
        try {
            await axios.put(`https://localhost:7141/api/v1/Announc/${announcementId}`, updatedAnnouncement, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            console.log("Announcement updated successfully");
            console.log(updatedAnnouncement);
        } catch (error) {
            console.error("Error updating the announcement:", error);
        }
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
        const dateA = new Date(a.announcementDate);
        const dateB = new Date(b.announcementDate);
        return isSortedAsc ? dateB - dateA : dateA - dateB; // Sort based on the current sort order
      }),
    );
  };

  if (!announcements.length) {
    return <CircularProgress>Loading Announcements</CircularProgress>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "75vh",
        width: "90vw",
        overflow: "auto",
        padding: "2rem",
        borderRadius: "12px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        position: "relative",
        "@media (max-width: 600px)": {
          width: "100vw",
          padding: "1rem",
        },
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "inherit",
          zIndex: 1,
          paddingTop: "16px",
          fontWeight: "bold",
          fontSize: "1.75rem", // Slightly larger for emphasis
        }}
      >
        Announcements
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={handleSort} sx={{ mr: 1, color: "primary.main" }}>
          <SortIcon />
        </IconButton>
        <TextField
          size="small"
          label="Search Announcements"
          variant="outlined"
          sx={{ mr: 1, width: "250px" }} // Ensure adequate width for ease of typing
          onChange={handleSearchChange}
        />
      </Box>

      <List sx={{ overflow: "auto", mt: 2 }}>
        {Array.isArray(announcements) && announcements.length > 0 ? (
          announcements.map((announcement, index) => (
            <Announcement
              key={index}
              title={announcement.announcementTitle}
              content={announcement.announcementDescription}
              date={new Date(announcement.announcementDate).toISOString()}
              username={
                currentUser.claims[
                  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
                ]
              }
              currentUserId={currentUser.userName}
              announcementUserId={announcement.createdBy}
              announcementId={announcement.announcementId}
              onUpdate={handleUpdateAnnouncement}
              onDelete={() =>
                handleDeleteAnnouncement(announcement.announcementId)
              }
            />
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
            No announcements found.
          </Typography>
        )}
      </List>
      <AnnouncementModal
        open={modalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateAnnouncement}
      />
    </Box>
  );
};

export default AnnouncementList;
