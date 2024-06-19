import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl, FormLabel, Select, Tag, Text
} from '@chakra-ui/react';
import axios from 'axios';
import { BiUpload } from "react-icons/bi";

const LostPetPhotoUpload = ({ onMatchesFound }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [file, setFile] = useState(null);
  const [breed, setBreed] = useState('');
  const [catBreeds, setCatBreeds] = useState([]);
  const [dogBreeds, setDogBreeds] = useState([]);
  const [type, setType] = useState('Cat');
  const [matchedUrls, setMatchedUrls] = useState([]);
  const [predictedBreeds, setPredictedBreeds] = useState([]);

  useEffect(() => {
    const fetchCatBreeds = async () => {
      try {
        const response = await axios.get('https://api.thecatapi.com/v1/breeds');
        setCatBreeds(response.data);
      } catch (error) {
        console.error('Error fetching cat breeds:', error);
      }
    };

    const fetchDogBreeds = async () => {
      try {
        const response = await axios.get('https://api.thedogapi.com/v1/breeds');
        setDogBreeds(response.data);
      } catch (error) {
        console.error('Error fetching dog breeds:', error);
      }
    };

    fetchCatBreeds();
    fetchDogBreeds();
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setFile(file);

    // Create FormData to send the file
    const formData = new FormData();
    formData.append("label", "");
    formData.append("image", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Assuming the response contains an array of breeds
      const predictedBreeds = response.data.labels;
      console.log("Predicted breeds:", predictedBreeds);
      setPredictedBreeds(predictedBreeds);
    } catch (error) {
      console.error("Error uploading file and fetching breeds:", error);
    }
  };

  const handleSubmit = async () => {
    if (!file || !breed) return;

    const formData = new FormData();
    formData.append('image', file); // Adjusted to match Flask API's expected field name
    formData.append('label', breed); // Include the label as expected by the Flask API

    try {
      const response = await axios.post('http://127.0.0.1:5001/find_similar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data && response.data.similar_images) {
        const urls = response.data.similar_images.map(img => img.url);
        setMatchedUrls(urls);
        onMatchesFound(urls);
      }
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading photo and finding matches:', error);
    }
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue" size="md" boxShadow="md" px={8} py={4}>
        Find Match
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Pet Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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
            </FormControl>
            <FormControl mt={4} isRequired>
              <FormLabel>Type</FormLabel>
              <Select
                placeholder="Select type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Cat">Cat</option>
                <option value="Dog">Dog</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Breed</FormLabel>
              <Select
                placeholder="Breed"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                mb={2}
              >
                {type === "Dog" &&
                  dogBreeds.map((breed) => (
                    <option key={breed.id} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                {type === "Cat" &&
                  catBreeds.map((breed) => (
                    <option key={breed.id} value={breed.name}>
                      {breed.name}
                    </option>
                  ))}
                {predictedBreeds
                  .filter((breed) => !dogBreeds.some((dogBreed) => dogBreed.name === breed) && !catBreeds.some((catBreed) => catBreed.name === breed))
                  .map((breed) => (
                    <option key={breed} value={breed.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}>
                      {breed.charAt(0).toUpperCase() + breed.slice(1).replace(/_/g, ' ')}
                    </option>
                  ))}
              </Select>
              <FormLabel>
                <Text size="md" mb={2}>
                  Upload your photo for suggested breeds:
                </Text>
              </FormLabel>
              {predictedBreeds
                .filter((breed) => !dogBreeds.some((dogBreed) => dogBreed.name === breed) && !catBreeds.some((catBreed) => catBreed.name === breed))
                .map((breed) => (
                  <Tag
                    key={breed}
                    size="lg"
                    variant="outline"
                    colorScheme="blue"
                    mr={2}
                    mb={2}
                    cursor="pointer"
                    onClick={() => setBreed(breed.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()))}
                  >
                    {breed.charAt(0).toUpperCase() + breed.slice(1).replace(/_/g, ' ')}
                  </Tag>
                ))}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} colorScheme="teal" width="auto">
              Find Match
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LostPetPhotoUpload;