import {useState} from "react";
import {Box, Collapse, ListItem, ListItemText, Paper, TextField, Typography} from "@mui/material";
import {Cancel, Delete, ExpandLess, ExpandMore} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";

const Announcement = ({ title, content, date, onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedContent, setEditedContent] = useState(content);

    const handleClick = () => {
        setOpen(!open);
    };

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
                        <ListItemText primary={editedTitle} />
                        <Typography variant="body2" sx={{ marginRight: 2 }}>
                            {date}
                        </Typography>
                    </>
                )}

                {open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />}
                {isEditing ? (
                    <>
                        <IconButton onClick={handleSave}><SaveIcon /></IconButton>
                        <IconButton onClick={handleCancel}><Cancel /></IconButton>
                    </>
                ) : (
                    <IconButton onClick={handleEdit}><EditIcon /></IconButton>
                )}
                <IconButton onClick={onDelete}><Delete/></IconButton>
            </ListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ padding: "16px" }}>{editedContent}</Box>
            </Collapse>
        </Paper>
    );
};

export default Announcement;