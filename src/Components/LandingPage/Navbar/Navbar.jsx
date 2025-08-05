import React, { useState } from "react";
import "./Navbar.css";
import logo from "../../../Asserts/Img/logo.svg";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../../Config/Api";
import { toast } from "react-toastify";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const goTomainpage = () => navigate("/main");
  const gotheaboutuspage = () => navigate("/aboutus");
  const gotheblogpage = () => navigate("/blog");

  const handleSearchLawyers = async () => {
    try {
      await axios.get(`${BASE_URL}/auth/profile`, { withCredentials: true });
      navigate("/dashboard/seelawyer");
    } catch (error) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  };

  return (
    <nav className="navbardiv">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className={`uflex ${menuOpen ? "open" : ""}`}>
        <li><a href="/">Home</a></li>
        <li onClick={gotheaboutuspage}>About Us</li>
        <li onClick={gotheblogpage}>Blog</li>
        <li><a href="/">Practice Area</a></li>
        <li onClick={handleSearchLawyers}>Search Lawyers</li>
        <li className="mobile-signinbtn">
          <button onClick={goTomainpage}>Join Us</button>
        </li>
      </ul>

      <div onClick={goTomainpage} className="signinbtn">
        <button>Join Us</button>
      </div>

      <button className="menu-btn" onClick={toggleMenu}>
        <Icon icon={menuOpen ? "basil:cross-outline" : "gg:menu-right"} width="30" height="30" />
      </button>

      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}
    </nav>
  );
}
