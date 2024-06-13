import { useState } from "react";
import { FaEdit, FaSave, FaTimes, FaTrash } from "react-icons/fa";
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
} from "@chakra-ui/react";

const Announcement = ({
  title,
  content,
  date,
  username,
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  console.log(imageUrl);

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

  console.log("this is the image url", imageUrl);
  const isOwner = currentUserId === announcementUserId;

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
      <Box p={4} display="flex" flexDirection="column" gap={2}>
        {isEditing ? (
          <>
            <Input
              size="sm"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              mb={2}
            />
            <Input
              size="sm"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </>
        ) : (
          <>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Text fontWeight="semibold" fontSize="lg">
                  {editedTitle}
                </Text>
                <Box display="flex" alignItems="center" mt={1}>
                  <Avatar name={username} size="xs" mr={2} />
                  <Text fontSize="sm">{username}</Text>
                </Box>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  {date}
                </Text>
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
                        onClick={handleEdit}
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
          </>
        )}
      </Box>
      <Box p={4}>
        <Text mb={4}>{editedContent}</Text>
        {imageUrl && (
          <Box
            mt={4}
            mx="auto"
            maxW="md"
            borderRadius="md"
            overflow="hidden"
            boxShadow="md"
            cursor="pointer"
            onClick={handleImageModalOpen}
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
      </Box>
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
    </Container>
  );
};

export default Announcement;
