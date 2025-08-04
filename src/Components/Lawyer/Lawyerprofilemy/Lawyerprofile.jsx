import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultPic from '../../../Asserts/Img/man1.svg';
import './Lawyerprofile.css';

export default function LawyerProfile() {
  const [profile, setProfile] = useState({
    username: '',
    barNumber: '',
    specialization: '',
    contactNumber: '',
    location: '',
    dateOfBirth: '',
    about: '',
    profileImage: defaultPic,
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/v1/auth/profile', { withCredentials: true });
      const user = res.data.data;
      const profileData = user.profile;

      setProfile({
        username: user.username || '',
        barNumber: user.barNumber || '',
        specialization: user.specialization || '',
        contactNumber: profileData.contactNumber || '',
        location: profileData.location || '',
        dateOfBirth: profileData.dateOfBirth || '',
        about: profileData.about || '',
        profileImage: user.image || defaultPic,
      });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        'http://localhost:3000/api/v1/auth/profile/update',
        {
          username: profile.username,
          contactNumber: profile.contactNumber,
          location: profile.location,
          about: profile.about,
          dateOfBirth: profile.dateOfBirth,
        },
        { withCredentials: true }
      );
      alert('Profile updated successfully');
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Failed to update profile');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await axios.put('http://localhost:3000/api/v1/auth/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setProfile((prev) => ({ ...prev, profileImage: res.data.data.image }));
      alert('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to upload image');
    }
  };

  return (
    <div className="unique-profile-wrapper">
      <div className="unique-profile-card">
        <div className="profile-side">
          <div className="image-wrapper">
            <img src={profile.profileImage} alt="Profile" className="side-profile-pic" />
            {isEditing && (
              <label className="edit-pic-btn">
                📷 Change Photo
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </label>
            )}
          </div>
          <h2 className="lawyer-name">{profile.username}</h2>
          <p className="lawyer-location">📍 {profile.location}</p>
        </div>

        <div className="profile-main">
          <div className="header-with-edit">
            <h3 className="section-heading">Profile Information</h3>
            <button className="edit-toggle-btn" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'Cancel' : '✏️ Edit'}
            </button>
          </div>

          <div className="input-group">
            <label>Username</label>
            <input type="text" name="username" value={profile.username} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="input-group">
            <label>Bar Number</label>
            <input type="text" value={profile.barNumber} disabled readOnly />
          </div>

          <div className="input-group">
            <label>Specialization</label>
            <input type="text" value={profile.specialization} disabled readOnly />
          </div>

          <div className="input-group">
            <label>Phone</label>
            <input type="text" name="contactNumber" value={profile.contactNumber} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="input-group">
            <label>Location</label>
            <input type="text" name="location" value={profile.location} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="input-group">
            <label>Date of Birth</label>
            <input type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} disabled={!isEditing} />
          </div>

          <div className="input-group full-width">
            <label>About</label>
            <textarea name="about" rows="4" value={profile.about} onChange={handleChange} disabled={!isEditing} />
          </div>

          {isEditing && (
            <button className="update-btn" onClick={handleSave}>
              💾 Save Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
