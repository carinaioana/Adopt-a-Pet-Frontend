import { useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Textarea,
  Heading,
  Progress,
} from "@chakra-ui/react";
import { BiUpload } from "react-icons/bi";

const AnnouncementModal = ({ open, onClose, onCreate }) => {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleCreate = () => {
    const formData = new FormData();
    formData.append("AnnouncementTitle", announcementTitle);
    formData.append("AnnouncementDescription", announcementDescription);
    formData.append("AnnouncementDate", new Date().toISOString());
    if (selectedFile) {
      formData.append("ImageFile", selectedFile);
    }
    onCreate(formData);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Simulate file upload progress
    const simulateUpload = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 100);
    };

    simulateUpload();
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Announcement</ModalHeader>
        <ModalBody>
          <Box
            as="form"
            mt={2}
            overflow="auto"
            maxH="70vh"
            width="100%"
            maxWidth={600}
            display="flex"
            flexDirection="column"
          >
            <Input
              mb={4}
              placeholder="Announcement Title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              isRequired
            />
            <Textarea
              mb={4}
              placeholder="Description"
              value={announcementDescription}
              onChange={(e) => setAnnouncementDescription(e.target.value)}
              isRequired
              rows={4}
            />
            <Button
              as="label"
              variant="outline"
              colorScheme="blue"
              leftIcon={<BiUpload />}
              mb={4}
            >
              Upload Image
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            {selectedFile && (
              <Box mt={2}>
                <Heading size="sm" mb={2}>
                  {selectedFile.name}
                </Heading>
                <Progress value={uploadProgress} size="sm" colorScheme="blue" />
              </Box>
            )}
          </Box>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="space-between">
          <Button
            colorScheme="blue"
            onClick={handleCreate}
            isDisabled={!announcementTitle || !announcementDescription}
          >
            Create
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AnnouncementModal;
