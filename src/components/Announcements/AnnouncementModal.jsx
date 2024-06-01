import { useState } from "react";
import { Box, Typography, TextField, Button, Modal } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 480,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 5,
  borderRadius: 2,
};

const AnnouncementModal = ({ open, onClose, onCreate }) => {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [file, setFile] = useState(null);

  const handleCreate = () => {
    // Assuming you handle the file upload separately and just pass the file object for now
    const newAnnouncement = {
      announcementTitle,
      announcementDescription,
      file,
    };
    onCreate(newAnnouncement);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="create-announcement-modal"
      aria-describedby="create-announcement-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="create-announcement-modal" variant="h6" component="h2">
          Create New Announcement
        </Typography>
        <Box component="form" sx={{ mt: 2 }} noValidate autoComplete="off">
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Announcement Title"
            name="title"
            autoFocus
            value={announcementTitle}
            onChange={(e) => setAnnouncementTitle(e.target.value)}
            sx={{ mb: 2 }} // Added bottom margin
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="description"
            label="Description"
            id="description"
            multiline
            rows={6} // Increased row count for better visibility
            value={announcementDescription}
            onChange={(e) => setAnnouncementDescription(e.target.value)}
            sx={{ mb: 2 }} // Added bottom margin
          />
          <Button
            component="label"
            fullWidth
            variant="outlined"
            sx={{
              mt: 3,
              mb: 2,
              borderColor: "primary.light",
              color: "primary.main",
            }} // Lighter variant for upload
            startIcon={<UploadFile />}
          >
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              mb: 2,
              backgroundColor: "primary.main",
              "&:hover": { backgroundColor: "primary.dark" },
            }} // Primary action styling
            onClick={handleCreate}
          >
            Create
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            sx={{ mb: 2, color: "text.secondary" }} // Less prominent cancel button
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AnnouncementModal;
