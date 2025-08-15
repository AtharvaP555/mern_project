import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/home.css";

const EditSkillOffer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });
  const [loading, setLoading] = useState(true);

  const categories = [
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "Video Editing",
    "Tutoring",
    "Music Lessons",
    "Other",
  ];

  useEffect(() => {
    const fetchOffer = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(
          `http://localhost:5000/api/skill-offers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch skill offer");
        const data = await res.json();
        setFormData({
          title: data.title,
          description: data.description,
          category: data.category,
          price: data.price,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        alert("Error fetching skill offer");
        navigate("/my-skill-offers");
      }
    };

    fetchOffer();
  }, [id, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to update a skill offer.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/skill-offers/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update skill offer");

      alert("Skill Offer updated successfully!");
      navigate("/my-skill-offers");
    } catch (error) {
      console.error(error);
      alert("Error updating skill offer.");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="form-container">
      <h2 className="form-title">Edit Skill Offer</h2>
      <form onSubmit={handleSubmit} className="glass-form">
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <label>Price ($)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          min="0"
          required
        />

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button type="submit" className="my-skill-offers-btn">
            Update
          </button>
          <button
            type="button"
            className="delete-btn"
            onClick={() => navigate("/my-skill-offers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSkillOffer;
