import PasswordChecklist from "react-password-checklist";
import { Tooltip } from "@mui/material";
import React, { useState } from "react";

const PasswordTooltip = ({ children, password, confirmPassword }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <Tooltip
      open={showTooltip}
      title={
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
      }
      placement="bottom"
      arrow
      // Using onMouseOver and onMouseOut for simplicity; adjust as needed for touch screens or keyboard accessibility
      onMouseOver={() => setShowTooltip(true)}
      onMouseOut={() => setShowTooltip(false)}
      onFocus={() => setShowTooltip(true)} // Assuming you want the tooltip on focus
      onBlur={() => setShowTooltip(false)}
    >
      {React.cloneElement(children, {
        // Ensuring children can trigger these events
        onMouseOver: () => setShowTooltip(true),
        onMouseOut: () => setShowTooltip(false),
        onFocus: () => setShowTooltip(true),
        onBlur: () => setShowTooltip(false),
      })}
    </Tooltip>
  );
};

export default PasswordTooltip;
