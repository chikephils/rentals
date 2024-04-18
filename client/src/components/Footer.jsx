import React from "react";
import "../styles/Footer.scss";
import { Link } from "react-router-dom";
import { Email } from "@mui/icons-material";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_left">
        <Link to="/">
          <img src="/assets/logo.png" alt="logo" />
        </Link>
      </div>
      <div className="footer_center">
        <h4>Useful Links</h4>
        <ul>
          <li>About Us</li>
          <li>Terms and Conditions</li>
          <li>Return and Refund Policy</li>
        </ul>
      </div>
      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <Email />
          <p>chireva@support.com</p>
        </div>
        <img src="/assets/payment.png" alt="paymet" />
      </div>
    </div>
  );
};

export default Footer;
