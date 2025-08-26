import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/favorites/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setFavorites(res.data));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const cardStyle = {
    margin: "10px",
    border: "2px solid #e63946",
    borderRadius: "10px",
    padding: "10px",
    textAlign: "center",
    width: "140px",
    backgroundColor: "#1a1a1a",
    color: "white",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const cardHover = {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #e63946",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0d0d0d",
        backgroundImage:
          "url('https://images4.alphacoders.com/126/thumb-1920-1264065.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        color: "white",
        padding: "20px",
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Favorite Agents</h1>
        <div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#e63946",
              color: "white",
              border: "none",
              padding: "8px 12px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
          <Link to="/home">
            <button
              style={{
                backgroundColor: "#e63946",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Back to Home
            </button>
          </Link>
        </div>
      </header>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {favorites.length === 0 ? (
          <p>No favorites yet!</p>
        ) : (
          favorites.map((agent) => (
            <div
              key={agent.id}
              style={cardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
            >
              <p style={{ fontWeight: "bold" }}>{agent.agent_name}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
