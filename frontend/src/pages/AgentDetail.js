import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function AgentDetail() {
  const { agentUuid } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchAgentDetail() {
      try {
        // Fetch data for the specific agent using the uuid from the URL
        const url = `https://valorant-api.com/v1/agents/${agentUuid}`;
        const res = await axios.get(url);
        
        // The API returns the specific agent object inside the 'data' field
        setAgent(res.data.data); 
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch agent details:", err);
        setError("Failed to load agent details. Please try again.");
        setLoading(false);
      }
    }
    fetchAgentDetail();
  }, [agentUuid]);

  if (loading) {
    return <div style={{ color: "white", padding: "20px" }}>Loading agent details...</div>;
  }

  if (error) {
    return <div style={{ color: "red", padding: "20px" }}>{error}</div>;
  }

  // --- Styling for the Agent Detail Page (similar to your existing theme) ---
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "white",
    padding: "40px",
    backgroundImage: "url('https://images4.alphacoders.com/126/thumb-1920-1264065.png')",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };
  
  const abilityStyle = {
      backgroundColor: "#1a1a1a",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "15px",
      border: "1px solid #e63946",
  };
  // ------------------------------------------------------------------------

  return (
    <div style={containerStyle}>
      <Link to="/home" style={{ color: "#e63946", fontWeight: "bold", textDecoration: "none" }}>
        &lt; Back to Agents
      </Link>
      
      <h1 style={{ marginTop: "20px", color: "#ff4655" }}>{agent.displayName}</h1>
      <p style={{ fontStyle: "italic", color: "#aaa" }}>{agent.role.displayName} - "{agent.developerName}"</p>
      
      <div style={{ display: "flex", alignItems: "flex-start", marginTop: "20px" }}>
        {/* Use a higher resolution portrait for the detail view */}
        <img
          src={agent.fullPortraitV2}
          alt={agent.displayName}
          style={{ width: "300px", height: "auto", borderRadius: "8px", marginRight: "30px" }}
        />
        <div>
          <h2>Description</h2>
          <p>{agent.description}</p>

          <h2 style={{ marginTop: "30px" }}>Abilities</h2>
          <div style={{ maxWidth: "600px" }}>
            {agent.abilities
              // Filter out the 'Passive' ability as it often doesn't have good descriptions or icons
              .filter(ability => ability.slot !== "Passive") 
              .map((ability, index) => (
              <div key={index} style={abilityStyle}>
                <h3 style={{ margin: 0, color: "#06d6a0" }}>
                  {ability.displayName} ({ability.slot})
                  {ability.displayIcon && (
                    <img src={ability.displayIcon} alt={ability.displayName} style={{ height: '24px', width: '24px', marginLeft: '10px', verticalAlign: 'middle' }} />
                  )}
                </h3>
                <p style={{ margin: "5px 0 0 0" }}>{ability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}