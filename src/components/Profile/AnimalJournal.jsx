import { Paper, Tab, Tabs, Typography, Box, Avatar, Grid } from "@mui/material";
import { useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`notebook-tabpanel-${index}`}
      aria-labelledby={`notebook-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Notebook() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Sample data, replace with actual data
  const animalDetails = {
    photo: "/path/to/photo.jpg", // Replace with actual photo path
    name: "Buddy",
    dob: "2020-04-15",
    race: "Golden Retriever",
    vaccines: ["Rabies", "Distemper", "Parvovirus"],
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "auto",
        margin: "auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12} sm={4}>
          <Avatar
            alt="Animal Photo"
            src={animalDetails.photo}
            sx={{ width: 128, height: 128 }}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography variant="h5">{animalDetails.name}</Typography>
          <Typography>Date of Birth: {animalDetails.dob}</Typography>
          <Typography>Race: {animalDetails.race}</Typography>
        </Grid>
      </Grid>
      {/* Tabs act as a "Table of Contents" */}
      <Tabs
        value={value}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Notes" />
        <Tab label="Reminders" />
        <Tab label="Ideas" />
        <Tab label="Vaccines/Treatments" />
      </Tabs>
      <TabPanel value={value} index={0}>
        Your notes go here.
      </TabPanel>
      <TabPanel value={value} index={1}>
        Your reminders go here.
      </TabPanel>
      <TabPanel value={value} index={2}>
        Your ideas go here.
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Typography variant="h6">Vaccines/Treatments:</Typography>
        <ul>
          {animalDetails.vaccines.map((vaccine, index) => (
            <li key={index}>{vaccine}</li>
          ))}
        </ul>
      </TabPanel>
    </Paper>
  );
}
