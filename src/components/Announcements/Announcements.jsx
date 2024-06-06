import { useEffect, useState } from "react";
import { Box, List, TextField, Typography } from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import IconButton from "@mui/material/IconButton";
import AnnouncementModal from "./AnnouncementModal.jsx";
import axios from "axios";
import Announcement from "./Announcement.jsx";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../context/AuthContext.jsx";

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

    try {
      const response = await axios.post(
        "https://localhost:7141/api/v1/Announc",
        formData, // Directly use FormData object received from the modal
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // This is important for files
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
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            onClick={handleSort}
            sx={{ mr: 1, color: "primary.main" }}
          >
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
        <IconButton onClick={handleOpenModal} sx={{ color: "primary.main" }}>
          <AddIcon />
        </IconButton>
      </Box>

      <List sx={{ overflow: "auto", mt: 2 }}>
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
