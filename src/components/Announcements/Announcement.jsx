import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Chip,
  Collapse,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
  DialogContent,
} from "@mui/material";
import { Cancel, Delete, ExpandLess, ExpandMore } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

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
    onUpdate
}) => {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [openDialog, setOpenDialog] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
  const updatedAnnouncement = {
    announcementId: announcementId, // Assuming announcementId is available in the component's props
    announcementTitle: editedTitle,
    announcementDate: date, // Static value; adjust as needed
    imageUrl: "string", // Placeholder; replace with actual image URL or logic to handle image URLs
    announcementDescription: editedContent,
  };
  await onUpdate(announcementId, updatedAnnouncement);
  setIsEditing(false);
};

  const handleCancel = () => {
    setEditedTitle(title);
    setEditedContent(content);
    setIsEditing(false);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const isOwner = currentUserId === announcementUserId;
  console.log(isOwner);

  return (
    <Paper
      elevation={3}
      sx={{ marginBottom: "16px", borderRadius: "8px", overflow: "hidden" }}
    >
      <ListItem>
        {isEditing ? (
          <>
            <TextField
              variant="outlined"
              size="small"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              sx={{ marginRight: 1 }}
            />
            <TextField
              variant="outlined"
              size="small"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              sx={{ marginRight: 1 }}
            />
          </>
        ) : (
          <>
            <ListItemText
              primary={editedTitle}
              secondary={<Chip label={username} size="small" />}
            />
            <Typography variant="body2" sx={{ marginRight: 2 }}>
              {date}
            </Typography>
          </>
        )}

        {open ? (
          <ExpandLess onClick={handleClick} />
        ) : (
          <ExpandMore onClick={handleClick} />
        )}
        {isOwner && (
          <>
            {isEditing ? (
              <>
                <IconButton onClick={handleSave}>
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={handleCancel}>
                  <Cancel />
                </IconButton>
              </>
            ) : (
              <IconButton onClick={handleEdit}>
                <EditIcon />
              </IconButton>
            )}
            <IconButton onClick={handleDialogOpen}>
              <Delete />
            </IconButton>
          </>
        )}
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box sx={{ padding: "16px" }}>{editedContent}</Box>
      </Collapse>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Deletion"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this announcement?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            onClick={() => {
              onDelete();
              handleDialogClose();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Announcement;
