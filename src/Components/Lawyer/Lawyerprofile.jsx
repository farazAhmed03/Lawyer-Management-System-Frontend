import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./LawyerProfile.css";
import defaultImg from "../../Asserts/Img/man1.svg";
import BASE_URL from "../../Config/Api";
import handleError from "../../Utils/errorHandler";

export default function LawyerProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const lawyerId = id || localStorage.getItem("selectedLawyerId");
    const [lawyer, setLawyer] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        if (!lawyerId) {
            toast.error("Invalid Lawyer ID");
            navigate(-1);
            return;
        }
        fetchLawyer();
        fetchReviews();
    }, [lawyerId]);

    const fetchLawyer = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/users/SingleUser/${lawyerId}`, { withCredentials: true });
            setLawyer(res.data.data);
        } catch (err) {
            handleError(err, "Failed to fetch lawyer");
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/rating-and-review/${lawyerId}`, {
                withCredentials: true,
            });
            // console
            setReviews(res.data.data.reviews || []);
        } catch (err) {
            handleError(err, "Failed to fetch reviews");
        }
    };

    if (!lawyer) return <h2>Loading...</h2>;

    return (
        <div className="lawyer-profile-container">
            <div className="lawyer-profile-card">
                <img
                    src={lawyer.image || defaultImg}
                    alt={lawyer.username}
                    className="lawyer-profile-img"
                />

                <div className="lawyer-profile-details">
                    <h2>{lawyer.username}</h2>
                    <p><strong>Specialization:</strong> {lawyer.specialization || "Not Provided"}</p>
                    {/* <p><strong>Email:</strong> {lawyer.email}</p>
                    <p><strong>Bar Number:</strong> {lawyer.barNumber || "Not Provided"}</p> */}

                    <div className="lawyer-about">
                        <h3>About Lawyer</h3>
                        <p>{lawyer.profile?.about || "No bio provided yet."}</p>
                    </div>

                    <div className="lawyer-contact">
                        <h3>Additional Information</h3>
                        <p><strong>Gender:</strong> {lawyer.profile?.gender || "Not Provided"}</p>
                        <p><strong>Location:</strong> {lawyer.profile?.location || "Not Provided"}</p>
                    </div>

                    <div className="lawyer-actions">
                        <button
                            className="appointment-btn"
                            onClick={() => {
                                localStorage.setItem("selectedLawyerId", lawyer._id);
                                navigate(`/appointment/${lawyer._id}`);
                            }}
                        >
                            📅 Book Appointment
                        </button>
                    </div>

                    <button onClick={() => navigate(-1)} className="back-button">
                        ← Back
                    </button>
                </div>
            </div>

            <div className="lawyer-review-section">
                <h3>Client Reviews ⭐</h3>

                {reviews.length === 0 ? (
                    <div className="lawyer-review-placeholder">
                        <p style={{ fontStyle: "italic", color: "gray" }}>
                            No reviews yet.
                        </p>
                    </div>
                ) : (
                    reviews.map((review, index) => (
                        <div key={index} className="review-item">
                            <div className="review-user-info">
                                <img
                                    src={review.reviewer?.image || defaultImg}
                                    alt={review.reviewer?.username}
                                    className="review-user-img"
                                />
                                <div>
                                    <p className="review-username">{review.reviewer?.username}</p>
                                    <div className="review-stars">
                                        {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                                    </div>
                                </div>
                            </div>
                            <p className="review-content">"{review.review}"</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
