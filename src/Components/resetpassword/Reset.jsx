import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Reset.css';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`http://localhost:3000/api/v1/auth/reset-password/${token}`, {
                password,
                confirmPassword
            });

            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/Login');
            } 

        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-container">
            <div className="reset-card card shadow-lg p-4">
                <h2 className="text-center text-success mb-3 fw-bold">Reset Your Password</h2>
                <p className="text-muted text-center mb-4">Enter your new password below</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label fw-medium fs-5">New Password</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label fw-medium fs-5">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control form-control-lg"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-success w-100 fs-5 py-2" disabled={loading}>
                        {loading ? "Processing..." : "Reset Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}
