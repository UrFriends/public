import React from "react";

const Footer = () => {
  return (
    <footer>
      <div className="footer-contents">
        <p style={{ padding: "1em" }}>
          Jay Crawford - UrFriends - {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};
export default Footer;
