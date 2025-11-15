import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
// ... (existing state and useEffect)
  const [agents, setAgents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("https://valorant-api.com/v1/agents?isPlayableCharacter=true")
      .then((res) => setAgents(res.data.data));

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

  const toggleFavorite = async (agent) => {
    const exists = favorites.find((f) => f.agent_uuid === agent.uuid);
    if (exists) {
      await axios.delete(
        `http://127.0.0.1:8000/api/favorites/${exists.id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(favorites.filter((f) => f.agent_uuid !== agent.uuid));
    } else {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/favorites/",
        { agent_uuid: agent.uuid, agent_name: agent.displayName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites([...favorites, res.data]);
    }
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
  
  const linkContentStyle = {
    display: 'block',
    textDecoration: 'none',
    color: 'inherit',
    cursor: 'pointer',
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
        <h1>Valorant Agent Tracker</h1>
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
          
          {/* NEW BUTTON FOR MOST FAVORITED AGENTS */}
          <Link to="/top-agents"> 
            <button
              style={{
                backgroundColor: "#06d6a0", 
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              Most Favorited Agents
            </button>
          </Link>
          
          <Link to="/favorites">
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
              Favorites
            </button>
          </Link>
        </div>
      </header>

      <h2 style={{ marginTop: "20px" }}>Agents</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {agents.map((agent) => {
          const isFav = favorites.some((f) => f.agent_uuid === agent.uuid);
          return (
            <div
              key={agent.uuid}
              style={cardStyle}
              onMouseEnter={(e) =>
                Object.assign(e.currentTarget.style, cardHover)
              }
              onMouseLeave={(e) =>
                Object.assign(e.currentTarget.style, cardStyle)
              }
            >
              <Link 
                to={`/agent/${agent.uuid}`} 
                state={{ from: 'home' }} // Ensure the state is passed for correct back button text
                style={linkContentStyle}
              >
                <img
                  src={agent.displayIcon}
                  alt={agent.displayName}
                  width="100"
                  height="100"
                  style={{ borderRadius: "5px" }}
                />
                <p style={{ fontWeight: "bold" }}>{agent.displayName}</p>
              </Link>

              <button
                onClick={() => toggleFavorite(agent)}
                style={{
                  backgroundColor: isFav ? "#f1faee" : "#e63946",
                  color: isFav ? "#e63946" : "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  cursor: "pointer",
                }}
              >
                {isFav ? "Unfavorite" : "Favorite"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}