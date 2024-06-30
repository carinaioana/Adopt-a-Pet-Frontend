import { useEffect, useState, useCallback } from "react";
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
  Checkbox,
} from "@chakra-ui/react";
import { BiSortUp, BiSortDown, BiFilter } from "react-icons/bi";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useLoading } from "../context/LoadingContext.jsx";
import LoadingSpinner from "../LoadingSpinner.jsx";
import { useNotification } from "../context/NotificationContext.jsx";
import LostPetPhotoUpload from "./LostPetPhotoUpload.jsx";

const AnnouncementList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [originalAnnouncements, setOriginalAnnouncements] = useState([]);
  const { userDetails } = useAuth();
  const { isLoading, setIsLoading } = useLoading();
  const [modalOpen, setModalOpen] = useState(false);
  const { showSuccess, showError } = useNotification();
  const [isSortedAsc, setIsSortedAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    lost: false,
    found: false,
    adopt: false,
  });

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const handleFilterChange = (event) => {
    const { id, checked } = event.target;
    if (id === "selectAll") {
      setSelectedFilters({
        lost: checked,
        found: checked,
        adopt: checked,
      });
    } else {
      setSelectedFilters((prev) => ({
        ...prev,
        [id]: checked,
      }));
    }
  };

  const applyFilters = useCallback(() => {
    return originalAnnouncements.filter((announcement) => {
      const matchesSearch = announcement.announcementTitle
        .toLowerCase()
        .includes(searchQuery);
      const matchesCategory =
        (selectedFilters.lost && announcement.announcementTitle === "Lost") ||
        (selectedFilters.found && announcement.announcementTitle === "Found") ||
        (selectedFilters.adopt &&
          announcement.announcementTitle === "For Adoption") ||
        (!selectedFilters.lost &&
          !selectedFilters.found &&
          !selectedFilters.adopt);

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedFilters, originalAnnouncements]);

  useEffect(() => {
    const filteredResults = applyFilters();
    setAnnouncements(filteredResults);
  }, [searchQuery, selectedFilters, applyFilters]);

  const fetchAnnouncements = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("authToken");
      const announcementsResponse = await axios.get(
        "https://localhost:7141/api/v1/Announc",
      );

      const announcementsWithUser = await Promise.all(
        announcementsResponse.data.announcements.map(async (announcement) => {
          const userResponse = await axios.get(
            `https://localhost:7141/api/v1/Authentication/userinfo/${announcement.createdBy}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
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
      setOriginalAnnouncements(announcementsWithUser);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      showError("Failed to fetch announcements");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (formData) => {
    const token = localStorage.getItem("authToken");

    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://localhost:7141/api/v1/Announc",
        formData,
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
      showError("Failed to create announcement");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  const handleEditAnnouncement = async (announcementId, formData) => {
    const token = localStorage.getItem("authToken");

    try {
      setIsLoading(true);
      const response = await axios.put(
        `https://localhost:7141/api/v1/Announc/${announcementId}`,
        formData,
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
        showError("Failed to edit announcement");
      }
    } catch (error) {
      console.error("Error editing announcement:", error);
      showError("Failed to edit announcement");
    } finally {
      setIsLoading(false);
      handleCloseModal();
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `https://localhost:7141/api/v1/Announc/${announcementId}`,
      );

      if (response.status === 200) {
        showSuccess("Announcement deleted successfully");
        setAnnouncements((prev) =>
          prev.filter(
            (announcement) => announcement.announcementId !== announcementId,
          ),
        );
        setOriginalAnnouncements((prev) =>
          prev.filter(
            (announcement) => announcement.announcementId !== announcementId,
          ),
        );
      } else {
        showError("Failed to delete announcement");
      }
    } catch (error) {
      console.error("Error deleting announcement:", error);
      showError("Failed to delete announcement");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = () => {
    setIsSortedAsc((prev) => !prev);
    setAnnouncements((currentAnnouncements) =>
      [...currentAnnouncements].sort((a, b) => {
        const titleA = a.announcementTitle.toLowerCase();
        const titleB = b.announcementTitle.toLowerCase();
        return isSortedAsc
          ? titleA.localeCompare(titleB)
          : titleB.localeCompare(titleA);
      }),
    );
  };

  const handleMatchesFound = (urls) => {
    const normalizedUrls = urls.map((url) =>
      url.replace("s3.eu-north-1.amazonaws.com", "s3.amazonaws.com"),
    );
    const matchedAnnouncements = originalAnnouncements.filter((announcement) =>
      normalizedUrls.includes(
        announcement.imageUrl
          .trim()
          .replace("s3.eu-north-1.amazonaws.com", "s3.amazonaws.com"),
      ),
    );
    setAnnouncements(matchedAnnouncements);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <Container
        display="flex"
        flexDirection="column"
        minWidth={{ base: "90vw", md: "80vw" }}
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
          flexDirection={{ base: "column", md: "row" }}
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
            flexDirection={{ base: "column", sm: "row" }}
            alignItems="center"
            gap={4}
          >
            <LostPetPhotoUpload onMatchesFound={handleMatchesFound} />

            <Box display="flex" alignItems="center" gap={4}>
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={IconButton}
                  icon={<BiFilter />}
                  colorScheme="blue"
                />
                <MenuList>
                  <MenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      const newValue =
                        !Object.values(selectedFilters).every(Boolean);
                      handleFilterChange({
                        target: { id: "selectAll", checked: newValue },
                      });
                    }}
                  >
                    <Checkbox
                      id="selectAll"
                      isChecked={Object.values(selectedFilters).every(Boolean)}
                    >
                      Select All
                    </Checkbox>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterChange({
                        target: { id: "lost", checked: !selectedFilters.lost },
                      });
                    }}
                  >
                    <Checkbox id="lost" isChecked={selectedFilters.lost}>
                      Lost
                    </Checkbox>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterChange({
                        target: {
                          id: "found",
                          checked: !selectedFilters.found,
                        },
                      });
                    }}
                  >
                    <Checkbox id="found" isChecked={selectedFilters.found}>
                      Found
                    </Checkbox>
                  </MenuItem>
                  <MenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      handleFilterChange({
                        target: {
                          id: "adopt",
                          checked: !selectedFilters.adopt,
                        },
                      });
                    }}
                  >
                    <Checkbox id="adopt" isChecked={selectedFilters.adopt}>
                      Adopt
                    </Checkbox>
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
                value={searchQuery}
                borderColor="blue.500"
              />
              <IconButton
                aria-label="Add Announcement"
                icon={<AddIcon />}
                onClick={handleOpenModal}
                colorScheme="blue"
              />
              {(searchQuery ||
                Object.values(selectedFilters).some(Boolean)) && (
                <Button
                  leftIcon={<CloseIcon />}
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFilters({
                      lost: false,
                      found: false,
                      adopt: false,
                    });
                  }}
                  size="md"
                  px={6}
                >
                  Clear
                </Button>
              )}
            </Box>
          </Box>
        </Box>
        <Box
          overflowY="auto"
          maxH="80vh"
          p={4}
          borderRadius="md"
          boxShadow="md"
          display="flex"
          flexWrap="wrap"
          gap={4}
          justifyContent="flex-start"
        >
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <Box
                key={announcement.announcementId}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                p={4}
                boxShadow="sm"
                _hover={{
                  boxShadow: "lg",
                  transform: "scale(1.02)",
                  cursor: "pointer",
                }}
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
                  isHomePage={false}
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
