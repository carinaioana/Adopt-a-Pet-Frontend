import { useEffect, useState } from "react";
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
  Select,
  FormLabel,
  FormControl,
  Tag,
  Text,
} from "@chakra-ui/react";
import { BiUpload } from "react-icons/bi";
import axios from "axios";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
  getLatLng,
} from "react-google-places-autocomplete";

const AnnouncementModal = ({ open, onClose, onCreate }) => {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementDescription, setAnnouncementDescription] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [animalBreed, setAnimalBreed] = useState("");
  const [animalGender, setAnimalGender] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState("");
  const [dateLostFound, setDateLostFound] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);
  const [predictedBreeds, setPredictedBreeds] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await axios.get("https://api.thedogapi.com/v1/breeds");
        setDogBreeds(response.data);
      } catch (error) {
        console.error("Error fetching dog breeds:", error);
      }
    };

    const fetchCatBreeds = async () => {
      try {
        const response = await axios.get("https://api.thecatapi.com/v1/breeds");
        setCatBreeds(response.data);
      } catch (error) {
        console.error("Error fetching cat breeds:", error);
      }
    };

    fetchDogBreeds();
    fetchCatBreeds();
  }, []);

  const handleCreate = () => {
    const formData = new FormData();
    formData.append("AnnouncementTitle", announcementTitle);
    formData.append("AnnouncementDescription", announcementDescription);
    formData.append("AnnouncementDate", new Date().toISOString());
    formData.append("AnimalType", animalType);
    formData.append("AnimalBreed", animalBreed);
    formData.append("AnimalGender", animalGender);
    formData.append("Age", age);
    formData.append("Color", color);
    formData.append("DateLostFound", dateLostFound);
    formData.append("Location", location);
    if (selectedFile) {
      formData.append("ImageFile", selectedFile);
    }
    onCreate(formData);
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("label", "");
    formData.append("image", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(progress);
          },
        },
      );

      const predictedBreeds = response.data.labels;
      console.log("Predicted breeds:", predictedBreeds);
      setPredictedBreeds(predictedBreeds);
    } catch (error) {
      console.error("Error uploading file and fetching breeds:", error);
    }

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

  const handleLocationChange = (value) => {
    if (value) {
      setSelectedLocation(value);
      geocodeByPlaceId(value.value.place_id)
        .then((results) => {
          const formattedAddress = results[0].formatted_address;
          setLocation(formattedAddress);
        })
        .catch((error) => {
          console.error("Error fetching location details:", error);
        });
    } else {
      setSelectedLocation(null);
      setLocation("");
    }
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
            <FormControl mb={4}>
              <FormLabel>Upload Image</FormLabel>
              <Button
                as="label"
                variant="outline"
                colorScheme="blue"
                leftIcon={<BiUpload />}
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
                  <Progress
                    value={uploadProgress}
                    size="sm"
                    colorScheme="blue"
                  />
                </Box>
              )}
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Announcement Type</FormLabel>
              <Select
                placeholder="Announcement Type"
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              >
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
                <option value="For Adoption">For Adoption</option>
              </Select>
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="Type"
                value={animalType}
                onChange={(e) => setAnimalType(e.target.value)}
              >
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Breed</FormLabel>
              <Select
                placeholder="Breed"
                value={animalBreed}
                onChange={(e) => setAnimalBreed(e.target.value)}
                mb={2}
              >
                {animalType === "Dog" &&
                  dogBreeds.map((breed) => (
                    <option key={breed.id} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                {animalType === "Cat" &&
                  catBreeds.map((breed) => (
                    <option key={breed.id} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                {predictedBreeds
                  .filter(
                    (breed) =>
                      !dogBreeds.some((dogBreed) => dogBreed.name === breed) &&
                      !catBreeds.some((catBreed) => catBreed.name === breed),
                  )
                  .map((breed) => (
                    <option
                      key={breed}
                      value={breed
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                    >
                      {breed.charAt(0).toUpperCase() +
                        breed.slice(1).replace(/_/g, " ")}
                    </option>
                  ))}
              </Select>
              <FormLabel>
                <Text size="md" mb={2}>
                  Upload your photo for suggested breeds:
                </Text>
              </FormLabel>
              {predictedBreeds
                .filter(
                  (breed) =>
                    !dogBreeds.some((dogBreed) => dogBreed.name === breed) &&
                    !catBreeds.some((catBreed) => catBreed.name === breed),
                )
                .map((breed) => (
                  <Tag
                    key={breed}
                    size="lg"
                    variant="outline"
                    colorScheme="blue"
                    mr={2}
                    mb={2}
                    cursor="pointer"
                    onClick={() =>
                      setAnimalBreed(
                        breed
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase()),
                      )
                    }
                  >
                    {breed.charAt(0).toUpperCase() +
                      breed.slice(1).replace(/_/g, " ")}
                  </Tag>
                ))}
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                placeholder="Gender"
                value={animalGender}
                onChange={(e) => setAnimalGender(e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Location</FormLabel>
              <GooglePlacesAutocomplete
                apiKey={import.meta.env.VITE_GOOGLE_API_KEY}
                selectProps={{
                  value: selectedLocation,
                  onChange: handleLocationChange,
                }}
                styles={{
                  container: (provided) => ({
                    ...provided.container,
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "10px",
                    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
                  }),
                  input: (provided) => ({
                    ...provided.input,
                    padding: "10px",
                    fontSize: "16px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                  }),
                  option: (provided, state) => ({
                    ...provided.option,
                    color: "black",
                    fontSize: "16px",
                    padding: "10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }),
                }}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Age</FormLabel>
              <Input
                placeholder="Age"
                value={age}
                onChange={(e) => {
                  setAge(e.target.value);
                  setAnnouncementDescription(
                    `Age: ${e.target.value}, Color: ${color}, Date when lost/found: ${dateLostFound}`,
                  );
                }}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Color</FormLabel>
              <Input
                placeholder="Color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setAnnouncementDescription(
                    `Age: ${age}, Color: ${e.target.value}, Date when lost/found: ${dateLostFound}`,
                  );
                }}
              />
            </FormControl>
            <FormControl mb={4} isRequired>
              <FormLabel>Date when lost/found</FormLabel>
              <Input
                type="date"
                value={dateLostFound}
                onChange={(e) => {
                  setDateLostFound(e.target.value);
                  setAnnouncementDescription(
                    `Age: ${age}, Color: ${color}, Date when lost/found: ${e.target.value}`,
                  );
                }}
              />
            </FormControl>
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
