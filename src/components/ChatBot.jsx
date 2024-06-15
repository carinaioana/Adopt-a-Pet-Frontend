import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  HStack,
  IconButton,
  Input,
  Spinner,
  VStack,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
const ChatContainer = ({ children }) => (
  <Box
    bg="white"
    w="100%"
    maxW="md"
    mx="auto"
    boxShadow="md"
    borderRadius="lg"
    overflow="hidden"
  >
    {children}
  </Box>
);

const ChatWindow = ({ children }) => (
  <VStack
    spacing={4}
    align="stretch"
    h="60vh"
    p={4}
    overflowY="auto"
    bg="gray.50"
  >
    {children}
  </VStack>
);

const ChatMessage = ({ isSent, children }) => (
  <HStack justifyContent={isSent ? "flex-end" : "flex-start"}>
    <Box
      maxW="80%"
      bg={isSent ? "blue.100" : "green.100"}
      p={3}
      borderRadius="lg"
    >
      {children}
    </Box>
  </HStack>
);

const Chatbot = (selectedPet) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const sendMessage = async () => {
    if (!input.trim()) return; // Prevent sending empty messages

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const petInfo = `
      Pet Name: ${selectedPet.selectedPet.animalName || "Unknown"}
      Type: ${selectedPet.selectedPet.animalType || "Unknown"}
      Breed: ${selectedPet.selectedPet.animalBreed || "Unknown"}
      Age: ${selectedPet.selectedPet.animalAge || "Unknown"}
      Sex: ${selectedPet.selectedPet.animalSex || "Unknown"}
      Vaccinations: ${selectedPet.selectedPet.vaccines ? selectedPet.selectedPet.vaccines.map((v) => `${v.name} on ${v.date}`).join(", ") : "None"}
      Dewormings: ${selectedPet.selectedPet.deworming ? selectedPet.selectedPet.deworming.map((d) => `${d.type} on ${d.date}`).join(", ") : "None"}
      Observations: ${selectedPet.selectedPet.observations ? selectedPet.selectedPet.observations.map((o) => `${o.description} on ${o.date}`).join(", ") : "None"}
    `;
      const prompt = [
        {
          role: "system",
          content: "You are a veterinary assistant.",
        },
        {
          role: "user",
          content: `Here is the pet's medical history:\n${petInfo}\n\n${input}`,
        },
      ];

      const aiResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo-0125",
          messages: prompt,
          n: 1,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer sk-proj-U9f1vAJMZ99hJ3d5NqwET3BlbkFJ5N33rACuPxIHUHuh4bbv`,
          },
        },
      );
      console.log(aiResponse.data);

      // Inside your try block, after receiving the AI response
      const botMessage = {
        sender: "assistant", // Changed from role to sender
        text: aiResponse.data.choices[0].message.content, // Changed from content to text
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again later.",
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContainer>
      <ChatWindow>
        {messages.map((msg, index) => (
          <ChatMessage key={index} isSent={msg.sender === "user"}>
            <Text>{msg.text}</Text>
          </ChatMessage>
        ))}
        {loading && <Spinner color="teal.500" />}
      </ChatWindow>
      <Box p={4}>
        <HStack>
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            variant="filled"
            bg="white"
          />
          <Tooltip label="Send your message" aria-label="Send message tooltip">
            <IconButton
              icon={<ArrowForwardIcon />}
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              colorScheme="teal"
              aria-label="Send message"
            />
          </Tooltip>
        </HStack>
      </Box>
    </ChatContainer>
  );
};

export default Chatbot;
