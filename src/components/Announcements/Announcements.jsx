import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    List,
    MenuItem,
    Menu,
    Checkbox,
    Button,
} from "@mui/material";
import { FilterList} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import AnnouncementModal from "./AnnouncementModal.jsx";
import axios from "axios";
import Announcement from "./Announcement.jsx";


const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [modalOpen, setModalOpen] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const [selectedFilters, setSelectedFilters] = useState(["All"]);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7141/api/v1/Announc",
        );
        setAnnouncements(response.data.announcements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchAnnouncements();
  }, []);

const handleCreateAnnouncement = async (newAnnouncement) => {
    // Add the current date and time to the newAnnouncement object
    const announcementWithDate = {
        ...newAnnouncement,
        announcementDate: new Date().toISOString(), // Set the current date and time in ISO format
    };

    try {
      const response = await axios.post(
        "https://localhost:7141/api/v1/Announc",
        announcementWithDate, // Use the updated object with the date
      );
      if (response.data.success) {
        console.log("Announcement created:", response.data.announcement);
        // Update the announcements list with the new announcement
        setAnnouncements(prevAnnouncements => [...prevAnnouncements, response.data.announcement]);
      } else {
        console.error("Failed to create announcement:", response.data.validationsErrors);
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    }
    handleCloseModal();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Function to handle filter selection
  const handleFilterSelect = (filter) => {
    if (filter === "All") {
      // If "All" is selected, either select all filters or clear the selection
      setSelectedFilters(
        selectedFilters.includes("All")
          ? []
          : ["All", "Adoption Events", "Foster Homes"],
      );
    } else {
      // For other filters, add or remove from the selection
      if (selectedFilters.includes(filter)) {
        setSelectedFilters(selectedFilters.filter((f) => f !== filter));
      } else {
        setSelectedFilters([
          ...selectedFilters.filter((f) => f !== "All"),
          filter,
        ]);
      }
    }
  };
  console.log(announcements);

  return (

    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "75vh",
        width: "90vw",
        overflow: "auto",
        padding: "1rem",
        borderRadius: "8px",
        border: "1px solid #ccc",
        boxShadow: "4px 8px 5px rgba(0, 0, 0, 0.3)",
        position: "relative",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "inherit", // Ensure the background matches the container
          zIndex: 1, // Make sure the title sticks on top of the scrolled content
          paddingTop: "16px", // Add padding to create space between the title and the top of the box
        }}
      >
        Announcements
      </Typography>
        <Button
            variant="contained"
            onClick={handleOpenModal}
            sx={{ mt: 2, mb: 2, alignSelf: "flex-end" }}
        >
            Create Announcement
        </Button>
        <AnnouncementModal
            open={modalOpen}
            onClose={handleCloseModal}
            onCreate={handleCreateAnnouncement}
        />
      <IconButton
        aria-label="filter list"
        onClick={handleClick}
        sx={{
          position: "absolute",
          right: 16,
          top: 16,
          zIndex: 2,
        }}
      >
        <FilterList />
      </IconButton>
      <Menu
        id="filter-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "filter-button",
        }}
      >
        <MenuItem onClick={() => handleFilterSelect("All")}>
          <Checkbox checked={selectedFilters.includes("All")} />
          All
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect("Adoption Events")}>
          <Checkbox checked={selectedFilters.includes("Adoption Events")} />
          Adoption Events
        </MenuItem>
        <MenuItem onClick={() => handleFilterSelect("Foster Homes")}>
          <Checkbox checked={selectedFilters.includes("Foster Homes")} />
          Foster Homes
        </MenuItem>
      </Menu>
      <List sx={{ overflow: "auto" }}>
        {Array.isArray(announcements) ? (
          announcements.map((announcement, index) => (
            <Announcement
              key={index}
              title={announcement.announcementTitle}
              content={announcement.announcementDescription}
              date={new Date(announcement.announcementDate).toLocaleString(
                "en-UK",
                {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            />
          ))
        ) : (
          <Typography variant="body1">No announcements found.</Typography>
        )}
      </List>

    </Box>
  );
};

export default AnnouncementList;
