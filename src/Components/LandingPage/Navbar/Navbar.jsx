import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import logo from "../../../Asserts/Img/logo.svg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="navbardiv">
        <div className="logo">
          <img src={logo} alt="Logo" />
        </div>

        <ul className={`uflex ${menuOpen ? "open" : ""}`}>
          <li><a href="/">Home</a></li>
          <li><a onClick={closeMenu}>About Us</a></li>
          <li><a onClick={closeMenu}>Blog</a></li>
          <li><a>Practice Area</a></li>
          <li><a onClick={closeMenu}>Search Lawyers</a></li>
          <li className="mobile-signinbtn">
            <button onClick={() => { closeMenu(); navigate("/main"); }}>Join Us</button>
          </li>
        </ul>

        <div onClick={() => navigate("/main")} className="signinbtn">
          <button>Join Us</button>
        </div>

        <button className="menu-btn" onClick={toggleMenu}>
          <Icon icon={menuOpen ? "mdi:close" : "gg:menu-right"} width="28" color="#111" />
        </button>
      </nav>

      {menuOpen && <div className="overlay" onClick={closeMenu}></div>}
    </>
  );
}
