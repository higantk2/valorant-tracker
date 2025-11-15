import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [allAgents, setAllAgents] = useState([]); // State to hold all agent data
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // 1. Fetch the list of ALL playable agents from the external API
        const agentsRes = await axios.get("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
        setAllAgents(agentsRes.data.data);

        // 2. Fetch the user's favorite list from your Django backend
        const favoritesRes = await axios.get("http://127.0.0.1:8000/api/favorites/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favoritesRes.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error (e.g., set an error state)
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAllData();
    }
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
  
  if (loading) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Loading favorites...
      </div>
    );
  }

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
          favorites.map((favorite) => {
            // Find the full agent data by matching the UUID
            const agentData = allAgents.find(
              (agent) => agent.uuid === favorite.agent_uuid
            );
            
            // Render only if agent data is found
            if (!agentData) return null;

            return (
              // Make the entire card link to the detail page
              <Link 
                key={favorite.id} 
                to={`/agent/${favorite.agent_uuid}`} 
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  style={cardStyle}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
                >
                  <img
                    src={agentData.displayIcon} // Display the agent icon
                    alt={favorite.agent_name}
                    width="100"
                    height="100"
                    style={{ borderRadius: "5px" }}
                  />
                  <p style={{ fontWeight: "bold" }}>{favorite.agent_name}</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}