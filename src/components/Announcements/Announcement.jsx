import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Cancel, Delete } from "@mui/icons-material";
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
  imageUrl,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedContent, setEditedContent] = useState(content);
  const [openDialog, setOpenDialog] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
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

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const isOwner = currentUserId === announcementUserId;

  return (
    <Paper
      elevation={3}
      sx={{
        marginBottom: "16px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
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
              secondary={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar sx={{ width: 24, height: 24, marginRight: 1 }} />
                  <Typography variant="body2">{username}</Typography>
                </Box>
              }
            />
            <Typography variant="body2" sx={{ marginRight: 2 }}>
              {date}
            </Typography>
          </>
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
      <Box sx={{ padding: "16px" }}>
        <Typography variant="body1" gutterBottom>
          {editedContent}
        </Typography>
        {imageUrl && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 2,
              overflow: "hidden",
              borderRadius: "12px",
              border: "2px solid #ccc",
              width: "fit-content",
              height: "fit-content",
              margin: "auto",
            }}
          >
            <CardMedia
              component="img"
              image={imageUrl}
              alt="Announcement"
              sx={{
                maxWidth: "100%",
                maxHeight: "300px",
                objectFit: "contain",
                margin: "auto",
              }}
            ></CardMedia>
          </Box>
        )}
      </Box>
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete Announcement"}
        </DialogTitle>
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
