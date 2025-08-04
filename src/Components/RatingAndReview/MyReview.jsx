import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MyReview.css";
import BASE_URL from "../../Config/Api";
import defaultImg from "../../Asserts/Img/man1.svg";

export default function MyReviews() {
  const { lawyerId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/rating-and-review/${lawyerId}`, {
          withCredentials: true,
        });
        console.log(res.data.data)
        setReviews(res.data.data.reviews || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [lawyerId]);

  if (loading) return <h3>Loading reviews...</h3>;

  return (
    <div className="my-reviews-container">
      <h2>My Reviews ⭐</h2>
      {reviews.length === 0 ? (
        <p style={{ color: "gray", fontStyle: "italic" }}>No reviews found.</p>
      ) : (
        reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-user-info">
              <img
                src={review.reviewer?.image || defaultImg}
                alt="Reviewer"
                className="review-user-img"
              />
              <div>
                <h4>{review.reviewer?.username}</h4>
                <p className="review-stars">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </p>
              </div>
            </div>
            <p className="review-comment">"{review.review}"</p>
            <p className="review-case-title">
              Related Case: <strong>{review.case?.title || "N/A"}</strong>
            </p>
          </div>
        ))
      )}
    </div>
  );
}
