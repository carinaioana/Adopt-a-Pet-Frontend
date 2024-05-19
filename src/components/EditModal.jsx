import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";

const EditModal = ({ open, context, onClose, onSave }) => {
  const [value, setValue] = useState("");
  const [date, setDate] = useState(""); // New state for managing date

  useEffect(() => {
    // Reset value and date to current context value when modal opens or context changes
    if (context.value) {
      setValue(context.value.name || context.value.observations || "");
      setDate(context.value.date || ""); // Set date if available
    }
  }, [context, open]);

  const handleSave = () => {
    let newValue;
    if (context.type === "vaccine" || context.type === "deworming") {
      newValue = { ...context.value, name: value, date: date }; // Include date in newValue
    } else if (context.type === "observations") {
      newValue = { observations: value };
    }
    onSave(newValue);
  };

  const renderContent = () => {
    switch (context.type) {
      case "vaccine":
      case "deworming":
        return (
          <>
            <TextField
              autoFocus
              margin="dense"
              label={
                context.type === "vaccine" ? "Vaccine Name" : "Deworming Type"
              }
              type="text"
              fullWidth
              variant="outlined"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <TextField
              margin="dense"
              label="Date"
              type="date"
              fullWidth
              variant="outlined"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </>
        );
      case "observations":
        return (
          <TextField
            autoFocus
            margin="dense"
            label="Observations"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Edit {context.type}</DialogTitle>
      <DialogContent>{renderContent()}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditModal;
