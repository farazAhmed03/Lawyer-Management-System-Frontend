import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../Config/Api";
import handleError from "../../Utils/errorHandler";
import "./ReviewForm.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReviewForm() {
    const { lawyerId, caseId } = useParams();
    const navigate = useNavigate();

    const [lawyer, setLawyer] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitDisabled, setSubmitDisabled] = useState(false);

    useEffect(() => {
        fetchLawyer();
    }, []);

    const fetchLawyer = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/users/SingleUser/${lawyerId}`, {
                withCredentials: true,
            });
            setLawyer(res.data.data);
        } catch (error) {
            handleError(error, "Failed to load lawyer profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                `${BASE_URL}/rating-and-review/${lawyerId}`,
                { rating, review },
                { withCredentials: true }
            );

            toast.success("Review submitted successfully");
            setSubmitDisabled(true);

            setTimeout(() => {
                navigate(`/lawyerprofile/${lawyerId}`);
            }, 1500);
        } catch (error) {
            handleError(error, "Failed to submit review");
        }
    };

    return (
        <div className="review-container">
            <ToastContainer />
            {loading ? (
                <p>Loading...</p>
            ) : lawyer ? (
                <div className="review-card">
                    <img
                        src={lawyer.image}
                        alt="Lawyer Profile"
                        className="lawyer-img"
                    />
                    <h3 className="lawyer-name">{lawyer.username}</h3>

                    <form onSubmit={handleSubmit} className="review-form">
                        <div className="rating-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={star <= rating ? "star selected" : "star"}
                                    onClick={() => !submitDisabled && setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>

                        <textarea
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                            placeholder="Write your feedback here..."
                            required
                            disabled={submitDisabled}
                        />

                        <button
                            type="submit"
                            className={`submit-btn ${submitDisabled ? "disabled" : ""}`}
                            disabled={submitDisabled}
                        >
                            {submitDisabled ? "Review Submitted" : "Submit Review"}
                        </button>
                    </form>
                </div>
            ) : (
                <p>Lawyer not found.</p>
            )}
        </div>
    );
}
