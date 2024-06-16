import { useEffect, useState } from "react";
import AnnouncementModal from "./AnnouncementModal.jsx";
import axios from "axios";
import Announcement from "./Announcement.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import "../../styles/Announcements.css";
import {
  Box,
  Container,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  Button,
  MenuList,
} from "@chakra-ui/react";
import { BiSortUp, BiSortDown, BiFilter } from "react-icons/bi";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { useLoading } from "../context/LoadingContext.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { useNotification } from "../context/NotificationContext.jsx";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const { userDetails } = useAuth();
  const { isLoading, setIsLoading } = useLoading();
  const [modalOpen, setModalOpen] = useState(false);
  const { showSuccess, showError } = useNotification();
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [, setSearchQuery] = useState("");
  const handleSearchChange = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchQuery(value);
    filterAnnouncements(value);
  };
  const handleFilterChange = (event) => {
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
      setIsLoading(true);
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
          return {
            ...announcement,
            userName: userResponse.data.name,
            userImage: userResponse.data.profilePhoto,
          };
        }),
      );

      setAnnouncements(announcementsWithUser);
      console.log(announcementsWithUser);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      showError("Failed to fetch announcements");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAnnouncement = async (formData) => {
    const token = localStorage.getItem("authToken");
    console.log(formData);
    try {
      setIsLoading(true);
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
        showSuccess("Announcement created successfully");
        fetchAnnouncements();
      } else {
        showError(
          "Failed to create announcement:",
          response.data.validationsErrors,
        );
      }
    } catch (error) {
      console.error("Error creating announcement:", error);
    } finally {
      setIsLoading(false);
    }
    handleCloseModal();
  };

  const handleEditAnnouncement = async (announcementId, formData) => {
    const token = localStorage.getItem("authToken");
    console.log(formData);
    try {
      setIsLoading(true);
      const response = await axios.put(
        `https://localhost:7141/api/v1/Announc/${announcementId}`,
        formData, // Directly use FormData object received from the modal
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.status === 200) {
        showSuccess("Announcement edited successfully");
        await fetchAnnouncements();
      } else {
        console.error("Failed to edit announcement:", response.data);
        showError("Failed to edit announcement");
      }
    } finally {
      setIsLoading(false);
    }
    handleCloseModal();
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      setIsLoading(true);
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
    } catch (error) {
      console.error("Error deleting announcement:", error);
    } finally {
      setIsLoading(false);
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
    <>
      {isLoading && <LoadingSpinner />}{" "}
      <Container
        display="flex"
        flexDirection="column"
        minWidth={{ base: "90vw", md: "80vw" }} // Responsive minWidth
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
          flexDirection={{ base: "column", md: "row" }} // Stack on small screens, row on medium and up
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
          <Box
            display="flex"
            flexDirection={{ base: "row", sm: "row" }} // Ensure filter and sort buttons are on the same row on mobile
            alignItems="center"
            gap={4}
          >
            <Menu closeOnSelect={false}>
              <MenuButton
                as={IconButton}
                icon={<BiFilter />}
                colorScheme="blue"
              />
              <MenuList>
                <MenuItem
                  onClick={(e) => {
                    const selectAllCheckbox =
                      document.getElementById("selectAll");
                    selectAllCheckbox.checked = !selectAllCheckbox.checked;
                    const checkboxes = document.querySelectorAll(
                      "#lost, #found, #adopt",
                    );
                    checkboxes.forEach((checkbox) => {
                      checkbox.checked = selectAllCheckbox.checked;
                    });
                    handleFilterChange(e); // Introduce handleFilterChange here
                  }}
                >
                  <label htmlFor="selectAll">Select All</label>
                  <input
                    type="checkbox"
                    id="selectAll"
                    style={{ marginLeft: "auto" }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    const checkbox = document.getElementById("lost");
                    checkbox.checked = !checkbox.checked;
                    handleFilterChange(e); // Introduce handleFilterChange here
                  }}
                >
                  <label htmlFor="lost">Lost</label>
                  <input
                    type="checkbox"
                    id="lost"
                    style={{ marginLeft: "auto" }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    const checkbox = document.getElementById("found");
                    checkbox.checked = !checkbox.checked;
                    handleFilterChange(e); // Introduce handleFilterChange here
                  }}
                >
                  <label htmlFor="found">Found</label>
                  <input
                    type="checkbox"
                    id="found"
                    style={{ marginLeft: "auto" }}
                  />
                </MenuItem>
                <MenuItem
                  onClick={(e) => {
                    const checkbox = document.getElementById("adopt");
                    checkbox.checked = !checkbox.checked;
                    handleFilterChange(e); // Introduce handleFilterChange here
                  }}
                >
                  <label htmlFor="adopt">Adopt</label>
                  <input
                    type="checkbox"
                    id="adopt"
                    style={{ marginLeft: "auto" }}
                  />
                </MenuItem>
              </MenuList>
            </Menu>
            <IconButton
              aria-label="Sort Announcements"
              icon={isSortedAsc ? <BiSortUp /> : <BiSortDown />}
              onClick={handleSort}
              colorScheme="blue"
            />
            <Input
              size="md"
              placeholder="Search Announcements"
              onChange={handleSearchChange}
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
        <Box
          overflowY="auto"
          maxH="70vh"
          p={4}
          borderRadius="md"
          boxShadow="md"
          display="flex"
          flexWrap="wrap"
          gap={4}
          justifyContent="flex-start"
        >
          {Array.isArray(announcements) && announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Box
                key={announcement.announcementId}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                boxShadow="sm"
              >
                <Announcement
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
                  userImage={announcement.userImage}
                  animalType={announcement.animalType}
                  animalBreed={announcement.animalBreed}
                  animalGender={announcement.animalGender}
                  location={announcement.location}
                  onEdit={handleEditAnnouncement}
                  onDelete={() =>
                    handleDeleteAnnouncement(announcement.announcementId)
                  }
                />
              </Box>
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
    </>
  );
};

export default AnnouncementList;
