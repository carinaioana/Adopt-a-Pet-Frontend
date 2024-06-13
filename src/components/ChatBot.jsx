import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { styled } from "@mui/system";

const ChatContainer = styled(Box)`
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
`;

const ChatWindow = styled(Paper)`
  padding: 2rem;
  margin-bottom: 2rem;
  height: 60vh;
  overflow: auto;
  position: relative;
  background-color: #f5f5f5;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ChatTitle = styled(Typography)`
  margin-bottom: 2rem;
  font-weight: bold;
  color: #333;
`;

const ChatList = styled(List)`
  max-height: 100%;
  overflow-y: auto;
`;

const ChatMessage = styled(ListItem)`
  margin-bottom: 1rem;
  text-align: ${(props) => (props.sender === "user" ? "right" : "left")};
  background-color: ${(props) =>
    props.sender === "user" ? "#e0f7fa" : "#f1f8e9"};
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  word-wrap: break-word;
  max-width: 80%;
  align-self: ${(props) =>
    props.sender === "user" ? "flex-end" : "flex-start"};
`;

const InputContainer = styled(Box)`
  display: flex;
  align-items: center;
`;

const ChatInput = styled(TextField)`
  flex-grow: 1;
  margin-right: 1rem;
`;

const SendButton = styled(Button)`
  && {
    background-color: #4caf50;
    color: #fff;
    &:hover {
      background-color: #43a047;
    }
  }
`;
const Chatbot = () => {
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
      // const response = await axios.post(
      //   "https://localhost:7141/api/animalHistory/get",
      //   {
      //     animalId: 1,
      //   },
      // );
      // const history = response.data;

      const prompt = [
        {
          role: "system",
          content: "You are a veterinary assistant.",
        },
        {
          role: "user",
          content: input, // Add the user's input here
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
        <ChatList>
          {messages.map((msg, index) => (
            <ChatMessage key={index} sender={msg.sender}>
              <ListItemText
                primary={msg.sender === "user" ? "You" : "Vet Assistant"}
                secondary={msg.text}
              />
            </ChatMessage>
          ))}
        </ChatList>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
            }}
          />
        )}
      </ChatWindow>
      <InputContainer>
        <ChatInput
          variant="outlined"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <SendButton
          variant="contained"
          onClick={sendMessage}
          disabled={loading}
          endIcon={<SendIcon />}
        >
          Send
        </SendButton>
      </InputContainer>
    </ChatContainer>
  );
};

export default Chatbot;
