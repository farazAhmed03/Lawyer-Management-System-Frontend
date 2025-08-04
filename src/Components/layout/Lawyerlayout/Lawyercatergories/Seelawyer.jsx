import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Seelawyer.css";
import axios from "axios";
import defaultImg from "../../../../Asserts/Img/man1.svg";
import BASE_URL from  "../../../../Config/Api";
import handleError from "../../../../Utils/errorHandler";

const categories = ["Divorce", "Criminal", "Civil", "Family", "Corporate", "Property"];

export default function Seelawyer() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [lawyers, setLawyers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/users/allLawyers`, { withCredentials: true });
      setLawyers(res.data.data);
    } catch (err) {
      handleError(err, "Failed to fetch lawyers");
    }
  };

  const filteredLawyers = lawyers.filter((lawyer) => {
    const specialization = lawyer.specialization?.toLowerCase() || "";
    const username = lawyer.username?.toLowerCase() || "";
    const location = lawyer.profile?.location?.toLowerCase() || "";

    const matchesCategory = selectedCategory === "All" || specialization.includes(selectedCategory.toLowerCase());
    const matchesSearch =
      username.includes(searchQuery.toLowerCase()) ||
      specialization.includes(searchQuery.toLowerCase()) ||
      location.includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="client-container">
      <h2 className="title">Find Your Lawyer</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name, specialization"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="category-list">
        <button className={selectedCategory === "All" ? "active" : ""} onClick={() => setSelectedCategory("All")}>
          All
        </button>
        {categories.map((cat, index) => (
          <button key={index} className={selectedCategory === cat ? "active" : ""} onClick={() => setSelectedCategory(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div className="lawyer-grid">
        {filteredLawyers.map((lawyer) => (
          <div className="lawyer-card" key={lawyer._id}>
            <img src={lawyer.image || defaultImg} alt={lawyer.username} />
            <h3>{lawyer.username}</h3>
            <p><strong>{lawyer.specialization}</strong> Lawyer</p>
            <p>{lawyer.profile?.location || "N/A"}</p>
            <button
              onClick={() => {
                localStorage.setItem("selectedLawyerId", lawyer._id);
                navigate(`/lawyerprofile/${lawyer._id}`);
              }}
              className="view-btn"
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
