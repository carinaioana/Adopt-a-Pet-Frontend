import { memo } from "react";
import { TableFooter } from "@mui/material";

const Footer = memo(function Footer() {
  return (
    <TableFooter>
      <p>&copy; Adopt A Friend {new Date().getFullYear()}</p>
    </TableFooter>
  );
});

export default Footer;
