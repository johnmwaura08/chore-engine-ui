import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center !important",
        position: "fixed",
        bottom: "0",
        width: "100%",
        textAlign: "center",
      }}
    >
      <p>&copy; {currentYear} John Mwaura. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
