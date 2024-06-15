import { useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash, FaUpload } from "react-icons/fa";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Image,
  useColorModeValue,
  Container,
  Textarea,
  Tag,
} from "@chakra-ui/react";

const Announcement = ({
  title,
  content,
  animalType,
  animalBreed,
  animalGender,
  location,
  onEdit,
  onDelete,
  currentUserId,
  announcementUserId,
  announcementId,
  imageUrl,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editedImage, setEditedImage] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleEditSave = () => {
    const formData = new FormData();
    formData.append("title", editedTitle);
    formData.append("content", editedContent);
    if (editedImage) {
      formData.append("image", editedImage);
    }
    onEdit(announcementId, formData); // Adjust the onEdit function to accept formData
    setIsEditModalOpen(false);
  };

  const handleImageChange = (e) => {
    setEditedImage(e.target.files[0]);
  };

  const handleSave = () => {
    onEdit(editedTitle, editedContent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleImageModalOpen = () => {
    setIsImageModalOpen(true);
  };

  const handleImageModalClose = () => {
    setIsImageModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false);
  };

  const isOwner = currentUserId === announcementUserId;
  console.log("Owner: ", isOwner, currentUserId, announcementUserId);

  return (
    <Container
      display="flex"
      flexDirection="column"
      bg={useColorModeValue("white", "gray.700")}
      boxShadow="md"
      borderRadius="md"
      overflow="hidden"
      mb={4}
    >
      <Box
        p={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box textAlign="center">
            <Tag size="lg" variant="solid" colorScheme="blue" mb={2}>
              {editedTitle}
            </Tag>
          </Box>
          {isOwner && (
            <Box display="flex" gap={2}>
              {isEditing ? (
                <>
                  <IconButton
                    icon={<FaSave />}
                    aria-label="Save"
                    onClick={handleSave}
                  />
                  <IconButton
                    icon={<FaTimes />}
                    aria-label="Cancel"
                    onClick={handleCancel}
                  />
                </>
              ) : (
                <>
                  <IconButton
                    icon={<FaEdit />}
                    aria-label="Edit"
                    onClick={handleEditModalOpen}
                  />
                  <IconButton
                    icon={<FaTrash />}
                    aria-label="Delete"
                    onClick={handleDeleteModalOpen}
                  />
                </>
              )}
            </Box>
          )}
        </Box>
      </Box>
      {imageUrl && (
        <Box
          mx="auto"
          maxW="xl"
          minW="xs"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="md"
          cursor="pointer"
          onClick={handleImageModalOpen}
          flex="1"
          m="0.5rem"
        >
          <Image
            src={imageUrl}
            alt="Announcement"
            maxH="200px"
            objectFit="cover"
            w="100%"
            onError={(e) => console.error("Image failed to load:", e)}
          />
        </Box>
      )}
      <Box p={4} flex="1" m="0.5rem">
        {animalType && (
          <Text mb={2}>
            <strong>Species:</strong> {animalType}
          </Text>
        )}
        {animalBreed && (
          <Text mb={2}>
            <strong>Breed:</strong> {animalBreed}
          </Text>
        )}
        {animalGender && (
          <Text mb={2}>
            <strong>Gender:</strong> {animalGender}
          </Text>
        )}
        {location && (
          <Text mb={2}>
            <strong>Location:</strong> {location}
          </Text>
        )}
        <Text mt={4}>
          {editedContent.split(", ").map((line, index) => (
            <Box key={index}>{line}</Box>
          ))}
        </Text>
      </Box>
      <Modal isOpen={isImageModalOpen} onClose={handleImageModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Image Preview</ModalHeader>
          <ModalBody>
            <Image
              src={imageUrl}
              alt="Announcement"
              w="100%"
              onError={(e) => console.error("Image failed to load:", e)}
            />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleImageModalClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isDeleteModalOpen} onClose={handleDeleteModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Announcement</ModalHeader>
          <ModalBody>
            <Text>Are you sure you want to delete this announcement?</Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleDeleteModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                onDelete();
                handleDeleteModalClose();
              }}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isEditModalOpen} onClose={handleEditModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Announcement</ModalHeader>
          <ModalBody>
            <Input
              placeholder="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              mb={3}
            />
            <Textarea
              placeholder="Content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              mb={3}
            />
            <Button as="label" variant="outline" leftIcon={<FaUpload />}>
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={handleEditModalClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleEditSave}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Announcement;
