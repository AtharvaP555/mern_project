import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

const MySkillOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOffers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "http://localhost:5000/api/skill-offers/my-offers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setOffers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://localhost:5000/api/skill-offers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(offers.filter((offer) => offer._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMyOffers();
  }, []);

  if (loading) return <p className="loading-text">Loading...</p>;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="my-offers-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="site-name" onClick={() => navigate("/home")}>
            SkillSwap
          </h2>
        </div>
        <div className="nav-center">
          <h2 style={{ color: "#ff7a30", textAlign: "center" }}>
            My Skill Offers
          </h2>
        </div>
        <div className="nav-right aligned-nav">
          <button
            className="my-skill-offers-btn"
            onClick={() => navigate("/add-skill-offer")}
          >
            Add Skill Offer
          </button>

          <FaUserCircle
            className="nav-icon"
            title="View Profile"
            onClick={() => navigate("/profile")}
          />
          <FaSignOutAlt
            className="nav-icon"
            title="Logout"
            onClick={handleLogout}
          />
        </div>
      </nav>

      <div className="offers-grid">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer._id} className="offer-card">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <p className="offer-category">Category: {offer.category}</p>
              <p className="offer-price">Price: ${offer.price}</p>
              <div className="offer-actions">
                <button
                  className="edit-btn"
                  onClick={() => navigate(`/edit-skill-offer/${offer._id}`)}
                >
                  Edit
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(offer._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No offers found</p>
        )}
      </div>
    </div>
  );
};

export default MySkillOffers;
