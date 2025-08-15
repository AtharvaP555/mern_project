import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { FaUserCircle, FaSignOutAlt, FaSearch } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [skillOffers, setSkillOffers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Fetch user profile
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
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProfile();
  }, [navigate]);

  // Fetch skill offers
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/skill-offers");
        if (!res.ok) throw new Error("Failed to fetch skill offers");
        const data = await res.json();
        setSkillOffers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const filteredOffers = skillOffers.filter((offer) =>
    offer.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <h2 className="site-name" onClick={() => navigate("/home")}>
            SkillSwap
          </h2>
        </div>
        <div className="nav-center">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
          </div>
        </div>
        <div className="nav-right aligned-nav">
          <button
            className="my-skill-offers-btn"
            onClick={() => navigate("/my-skill-offers")}
          >
            My Skill Offers
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

      {/* Skill Offers Grid */}
      <div className="offers-grid">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <div key={offer._id} className="offer-card">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              <p className="offer-category">Category: {offer.category}</p>
              <p className="offer-price">Price: ${offer.price}</p>
              <span className="offer-user">
                By: {offer.creatorName || "Unknown"}
              </span>
            </div>
          ))
        ) : (
          <p className="no-results">No skill offers found</p>
        )}
      </div>
    </div>
  );
};

export default Home;
