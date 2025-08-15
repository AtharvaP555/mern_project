import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

const AddSkillOffer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
  });

  const categories = [
    "Web Development",
    "Graphic Design",
    "Content Writing",
    "Video Editing",
    "Tutoring",
    "Music Lessons",
    "Other",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to create a skill offer.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/skill-offers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to create skill offer");

      alert("Skill Offer created successfully!");
      navigate("/my-skill-offers");
    } catch (error) {
      console.error(error);
      alert("Error creating skill offer.");
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">Add New Skill Offer</h2>
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
            Submit
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

export default AddSkillOffer;
