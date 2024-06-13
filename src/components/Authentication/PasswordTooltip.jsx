import PasswordChecklist from "react-password-checklist";
import { Tooltip, useDisclosure, Box } from "@chakra-ui/react";
import React, { useState } from "react";

const PasswordTooltip = ({ children, password, confirmPassword }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Tooltip
      isOpen={isOpen}
      label={
        <Box>
          <PasswordChecklist
            rules={["minLength", "specialChar", "number", "capital", "match"]}
            minLength={8}
            value={password}
            valueAgain={confirmPassword}
            messages={{
              minLength: "Password must be at least 8 characters long.",
              specialChar:
                "Password must contain at least one special character.",
              number: "Password must contain at least one number.",
              capital: "Password must contain at least one uppercase letter.",
              match: "Passwords must match.",
            }}
          />
        </Box>
      }
      placement="bottom"
      hasArrow
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
      onFocus={onOpen}
      onBlur={onClose}
    >
      {React.cloneElement(children, {
        onMouseEnter: onOpen,
        onMouseLeave: onClose,
        onFocus: onOpen,
        onBlur: onClose,
      })}
    </Tooltip>
  );
};

export default PasswordTooltip;
