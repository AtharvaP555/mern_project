import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", // optional - empty if user doesn't want to change
  });
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await res.json();
        setProfile(data);
        setFormData({ name: data.name, email: data.email, password: "" });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleEditToggle = () => {
    setSaveError("");
    if (isEditing) {
      // Cancel editing, reset form data to original profile data
      setFormData({ name: profile.name, email: profile.email, password: "" });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setSaveError("");
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Optional: Basic frontend validation here
    if (!formData.name.trim() || !formData.email.trim()) {
      setSaveError("Name and Email cannot be empty.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // API returns errors array or msg
        if (data.errors) {
          setSaveError(data.errors.map((e) => e.msg).join(", "));
        } else {
          setSaveError(data.msg || "Failed to update profile");
        }
        return;
      }

      // Update local profile state with new data
      setProfile({ ...profile, name: formData.name, email: formData.email });
      setIsEditing(false);
      setFormData((prev) => ({ ...prev, password: "" })); // clear password input
    } catch (err) {
      setSaveError("Something went wrong");
    }
  };

  if (loading) return <p className="loading">Loading profile...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="container">
      <h2>Profile</h2>

      <div className="form-group">
        <label>Name:</label>
        {isEditing ? (
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.name}</p>
        )}
      </div>

      <div className="form-group">
        <label>Email:</label>
        {isEditing ? (
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        ) : (
          <p>{profile.email}</p>
        )}
      </div>

      {isEditing && (
        <div className="form-group">
          <label>
            Password: <small>(Leave blank to keep unchanged)</small>
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
      )}

      {saveError && <p className="error-message">{saveError}</p>}

      <div className="button-group">
        <button onClick={handleEditToggle}>
          {isEditing ? "Cancel" : "Edit"}
        </button>
        {isEditing && <button onClick={handleSave}>Save</button>}
        <button onClick={() => navigate("/home")}>Back</button>
      </div>
    </div>
  );
};

export default Profile;
