import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
  useMediaQuery,
  Image,
  Box,
  VStack,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { animated, useSpring } from "react-spring";
import { useInView } from "react-intersection-observer";
import axios from "axios";
import LearnMoreModal from "../components/LearnMoreModal.jsx";
import Announcement from "./Announcements/Announcement.jsx";
import { useNotification } from "./context/NotificationContext.jsx";
import { useLoading } from "./context/LoadingContext.jsx";
import { Icon } from "@chakra-ui/icons";
import {
  FaClipboardList,
  FaNotesMedical,
  FaPaw,
  FaRobot,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ChakraCarousel from "../components/ChakraCarousel.jsx";

function Home() {
  const [isMobile] = useMediaQuery("(max-width: 600px)");
  const [isTablet] = useMediaQuery(
    "(min-width: 601px) and (max-width: 1024px)",
  );
  const [isDesktop] = useMediaQuery("(min-width: 1025px)");
  const { showError, showSuccess } = useNotification();
  const { isLoading, setIsLoading } = useLoading();
  const navigate = useNavigate();

  const [announcements, setAnnouncements] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleLearnMore = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const announcementsResponse = await axios.get(
          "https://localhost:7141/api/v1/Announc",
        );
        const token = localStorage.getItem("authToken");
        const announcementsWithUser = await Promise.all(
          announcementsResponse.data.announcements.map(async (announcement) => {
            const userResponse = await axios.get(
              `https://localhost:7141/api/v1/Authentication/userinfo/${announcement.createdBy}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            return {
              ...announcement,
              userName: userResponse.data.name,
              userImage: userResponse.data.profilePhoto,
            };
          }),
        );

        setAnnouncements(announcementsWithUser);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        showError("Failed to fetch announcements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 5 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <Container
      maxW={{
        base: "90vw",
        sm: "container.xs",
        md: "container.md",
        lg: "container.lg",
        xl: "container.xl",
      }}
      px={{ base: 4, md: 6 }}
      py={{ base: 5, md: 10 }}
    >
      <VStack spacing={{ base: 10, md: 20 }} align="center">
        {/* Hero Section */}
        <Box
          textAlign="center"
          w="full"
          backgroundImage="url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')"
          backgroundSize="cover"
          backgroundPosition="center"
          py={{ base: 10, md: 20 }}
          borderRadius="lg"
          overflow="hidden"
        >
          <Box
            bg="rgba(255, 255, 255, 0.8)"
            p={{ base: 4, md: 8 }}
            borderRadius="md"
            maxW="container.md"
            mx="auto"
          >
            <Heading
              as="h1"
              size={{ base: "xl", md: "2xl" }}
              mb={{ base: 2, md: 4 }}
            >
              Welcome to Adopt a Pet
            </Heading>
            <Text fontSize={{ base: "md", md: "xl" }} mb={{ base: 4, md: 6 }}>
              Your Perfect Pet Companion Awaits - Find Your Furry Soulmate
              Today!
            </Text>
            <Button
              colorScheme="blue"
              size={{ base: "md", md: "lg" }}
              onClick={() => navigate("/register")}
            >
              Sign Up Now
            </Button>
          </Box>
        </Box>

        {/* About Section */}
        <Box textAlign="center" w="full" overflow="hidden">
          <Heading
            as="h2"
            size={{ base: "lg", md: "xl" }}
            mb={{ base: 6, md: 10 }}
          >
            Our Unique Features
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 6, md: 10 }}
            px={{ base: 2, md: 0 }}
          >
            <Feature
              icon={FaSearch}
              title="Smart Pet Matching"
              description="Our innovative similarity algorithm aids in reuniting lost pets with their families and helps adopters find their ideal companions based on a picture."
            />
            <Feature
              icon={FaClipboardList}
              title="Create and Browse Announcements"
              description="Create detailed announcements with photos and descriptions. Browse through our extensive list of available pets."
            />
            <Feature
              icon={FaPaw}
              title="Comprehensive Pet Profiles"
              description="Each pet comes with a detailed profile, including personality traits, medical history, and care requirements."
            />
            <Feature
              icon={FaRobot}
              title="AI Pet Chatbot"
              description="Our intelligent chatbot is available 24/7 to provide expert advice and answer all your pet-related queries."
            />
            <Feature
              icon={FaNotesMedical}
              title="Medical History Tracker"
              description="Keep all your pet's health information in one place. Never miss an important date again."
            />
          </SimpleGrid>
        </Box>

        {/* Why Choose Us Section */}
        <Box
          textAlign="center"
          w="full"
          bg="gray.50"
          py={{ base: 6, md: 10 }}
          borderRadius="lg"
          overflow="hidden"
        >
          <Heading
            as="h2"
            size={{ base: "lg", md: "xl" }}
            mb={{ base: 4, md: 8 }}
          >
            Why Choose Adopt a Pet?
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 6, md: 10 }}
            maxW="container.lg"
            mx="auto"
            px={{ base: 2, md: 0 }}
          >
            <ChooseUsReason
              title="Save a Life"
              description="Give a deserving animal a second chance at happiness."
              image="https://images.unsplash.com/photo-1600272008408-6e05d5aa3e7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
            />
            <ChooseUsReason
              title="Find Your Perfect Match"
              description="Our smart algorithm ensures you find a pet that fits your lifestyle."
              image="https://images.unsplash.com/photo-1534361960057-19889db9621e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            />
          </SimpleGrid>
        </Box>

        {/* Recent Adoptions */}
        <Box w="full" py={{ base: 4, md: 8 }} overflow="hidden">
          <Heading
            as="h2"
            size={{ base: "lg", md: "xl" }}
            mb={{ base: 4, md: 8 }}
            textAlign="center"
          >
            Recent Adoptions
          </Heading>
          <ChakraCarousel gap={32}>
            {announcements.map((announcement) => (
              <Box
                key={announcement.announcementId}
                pointerEvents="none"
                opacity={1}
                transition="opacity 0.2s"
                maxW={{ base: "full", md: "sm" }}
                mx="auto"
                px={{ base: 2, md: 0 }}
              >
                <Announcement
                  title={announcement.announcementTitle}
                  content={announcement.announcementDescription}
                  date={new Date(announcement.announcementDate).toLocaleString(
                    "en-UK",
                  )}
                  username={announcement.userName}
                  announcementUserId={announcement.createdBy}
                  announcementId={announcement.announcementId}
                  imageUrl={announcement.imageUrl}
                  userImage={announcement.userImage}
                  animalType={announcement.animalType}
                  animalBreed={announcement.animalBreed}
                  animalGender={announcement.animalGender}
                  location={announcement.location}
                  isHomePage={true}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              </Box>
            ))}
          </ChakraCarousel>
        </Box>

        {/* Testimonials */}
        <Box textAlign="center" w="full" overflow="hidden">
          <Heading
            as="h2"
            size={{ base: "lg", md: "xl" }}
            mb={{ base: 4, md: 8 }}
          >
            Hear from Our Happy Adopters
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={{ base: 6, md: 10 }}
            maxW="container.lg"
            mx="auto"
            px={{ base: 2, md: 0 }}
          >
            <Testimonial
              quote="Thanks to Adopt A Pet, I found my perfect feline companion. The process was smooth, and the support has been amazing!"
              author="Sarah K."
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
            />
            <Testimonial
              quote="The similarity algorithm really works! We found a dog that matches our family perfectly."
              author="The Johnsons"
              image="https://images.unsplash.com/photo-1506863530036-1efeddceb993?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
            />
          </SimpleGrid>
        </Box>

        {/* Call to Action */}
        <Box
          textAlign="center"
          w="full"
          bg="blue.50"
          py={{ base: 6, md: 10 }}
          borderRadius="lg"
          overflow="hidden"
        >
          <Heading
            as="h2"
            size={{ base: "lg", md: "xl" }}
            mb={{ base: 2, md: 4 }}
          >
            Join the Adopt A Pet Family Today!
          </Heading>
          <Text fontSize={{ base: "md", md: "lg" }} mb={{ base: 4, md: 6 }}>
            Every pet deserves a loving home, and every home deserves the joy of
            a pet. Start your adoption journey with us!
          </Text>
          <Button
            colorScheme="blue"
            size={{ base: "md", md: "lg" }}
            mr={{ base: 2, md: 4 }}
            mb={{ base: 2, md: 0 }}
            onClick={() => navigate("/register")}
          >
            Create your account now
          </Button>
          <Button
            colorScheme="green"
            size={{ base: "md", md: "lg" }}
            onClick={handleLearnMore}
          >
            Learn About Our Similarity Algorithm
          </Button>
        </Box>
      </VStack>
      <LearnMoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
}

function Feature({ icon, title, description }) {
  return (
    <VStack>
      <Icon as={icon} w={8} h={8} color="blue.500" />
      <Heading as="h3" size={{ base: "sm", md: "md" }} mb={2}>
        {title}
      </Heading>
      <Text textAlign="center" fontSize={{ base: "sm", md: "md" }}>
        {description}
      </Text>
    </VStack>
  );
}

function ChooseUsReason({ title, description, image }) {
  return (
    <VStack>
      <Image
        src={image}
        alt={title}
        borderRadius="full"
        boxSize={{ base: "100px", md: "150px" }}
        objectFit="cover"
        mb={4}
      />
      <Heading as="h3" size={{ base: "sm", md: "md" }} mb={2}>
        {title}
      </Heading>
      <Text fontSize={{ base: "sm", md: "md" }}>{description}</Text>
    </VStack>
  );
}

function Testimonial({ quote, author, image }) {
  return (
    <Box bg="white" p={{ base: 4, md: 6 }} borderRadius="md" boxShadow="md">
      <Image
        src={image}
        alt={author}
        borderRadius="full"
        boxSize={{ base: "80px", md: "100px" }}
        objectFit="cover"
        mb={4}
        mx="auto"
      />
      <Text fontStyle="italic" mb={4} fontSize={{ base: "sm", md: "md" }}>
        "{quote}"
      </Text>
      <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>
        - {author}
      </Text>
    </Box>
  );
}

export default Home;
