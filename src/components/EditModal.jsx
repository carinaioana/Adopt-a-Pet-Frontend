import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
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
    const utcDate = new Date(date).toISOString();
    if (context.type === "vaccine" || context.type === "deworming") {
      newValue = { ...context.value, name: value, date: utcDate };
    } else if (context.type === "observations") {
      newValue = { ...context.value, observations: value, date: utcDate };
    }
    onSave(newValue);
  };

  const renderContent = () => {
    switch (context.type) {
      case "vaccine":
      case "deworming":
        return (
          <>
            <Input
              autoFocus
              mt="4"
              placeholder={
                context.type === "vaccine" ? "Vaccine Name" : "Deworming Type"
              }
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
            <Input
              mt="4"
              placeholder="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </>
        );
      case "observations":
        return (
          <>
            <Textarea
              autoFocus
              mt="4"
              placeholder="Observations"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={4}
            />
            <Input
              mt="4"
              placeholder="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={open} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit {context.type}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{renderContent()}</ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditModal;
