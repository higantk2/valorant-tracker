 import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function TopAgents() {
  const [topAgents, setTopAgents] = useState([]);
  const [allAgents, setAllAgents] = useState({}); // Stores all agent data for lookups
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch the list of ALL playable agents (for icons and IDs)
        const agentsRes = await axios.get("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
        // Convert array to a map (object) for easy lookup by agent UUID
        const agentsMap = agentsRes.data.data.reduce((map, agent) => {
          map[agent.uuid] = agent;
          return map;
        }, {});
        setAllAgents(agentsMap);

        // 2. Fetch the top favorited agents from the new Django endpoint
        const topRes = await axios.get("http://127.0.0.1:8000/api/favorites/top/");
        setTopAgents(topRes.data);
      } catch (err) {
        console.error("Failed to fetch top agents:", err);
        setError("Failed to load top agents leaderboard.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- Styles ---
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "white",
    padding: "40px",
    backgroundImage: "url('https://images4.alphacoders.com/126/thumb-1920-1264065.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
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
  
  const rankStyle = {
      position: 'absolute', 
      top: '-15px', 
      left: '-15px', 
      backgroundColor: '#ff4655', 
      borderRadius: '50%', 
      width: '30px', 
      height: '30px', 
      lineHeight: '30px', 
      fontWeight: 'bold',
      zIndex: 10,
  };
  // --------------

  if (loading) {
    return <div style={containerStyle}>Loading top agents...</div>;
  }

  if (error) {
    return <div style={containerStyle}><p style={{ color: "red" }}>{error}</p></div>;
  }

  return (
    <div style={containerStyle}>
      <Link to="/home" style={{ color: "#e63946", fontWeight: "bold", textDecoration: "none" }}>
        &lt; Back to Agents
      </Link>
      
      <h1 style={{ marginTop: "20px", color: "#ff4655" }}>Most Favorited Agents</h1>
      <p style={{ color: "#aaa" }}>The top 10 most favorited agents across all users.</p>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {topAgents.length === 0 ? (
          <p>No agents have been favorited yet!</p>
        ) : (
          topAgents.map((agent, index) => {
            const agentData = allAgents[agent.agent_uuid];
            
            // Only render if we have the full data for icon/details
            if (!agentData) return null;

            return (
              <Link 
                key={agent.agent_uuid} 
                to={`/agent/${agent.agent_uuid}`} 
                state={{ from: 'topAgents' }}
                style={{ textDecoration: 'none', color: 'inherit', position: 'relative' }}
              >
                <div
                  style={{ ...cardStyle, position: 'relative' }}
                  onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
                  onMouseLeave={(e) => Object.assign(e.currentTarget.style, cardStyle)}
                >
                    {/* Rank Indicator */}
                    <div style={rankStyle}>{index + 1}</div>
                    
                    <img
                        src={agentData.displayIcon}
                        alt={agent.agent_name}
                        width="100"
                        height="100"
                        style={{ borderRadius: "5px", marginTop: '5px' }}
                    />
                    <p style={{ fontWeight: "bold", marginBottom: '5px' }}>{agent.agent_name}</p>
                    <p style={{ margin: 0, fontSize: '14px', color: '#06d6a0' }}>{agent.count} Favorites</p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}