import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // For Password Change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState({ text: "", type: "" });

  // For User Search
  const [allAgents, setAllAgents] = useState({}); // For images
  const [searchUsername, setSearchUsername] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");

  // Fetch profile data and all agent data on load
  useEffect(() => {
    async function fetchData() {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // 1. Fetch user profile
        const profileRes = await axios.get("http://127.0.0.1:8000/api/users/profile/", { headers });
        setProfile(profileRes.data);
        
        // 2. Fetch all agents for image lookups
        const agentsRes = await axios.get("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
        const agentsMap = agentsRes.data.data.reduce((map, agent) => {
          map[agent.uuid] = agent;
          return map;
        }, {});
        setAllAgents(agentsMap);

      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [token]);

  // Handler for password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage({ text: "Updating...", type: "info" });
    try {
      const headers = { Authorization: `Bearer ${token}` };
      await axios.post(
        "http://127.0.0.1:8000/api/users/change-password/",
        { old_password: oldPassword, new_password: newPassword },
        { headers }
      );
      setPasswordMessage({ text: "✅ Password updated successfully!", type: "success" });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err.response.data);
      setPasswordMessage({ text: `❌ Error: ${JSON.stringify(err.response.data)}`, type: "error" });
    }
  };

  // Handler for searching other users
  const handleSearchUser = async (e) => {
    e.preventDefault();
    setSearchMessage("Searching...");
    setSearchResult(null);
    try {
      // This is a public endpoint, no token needed
      const res = await axios.get(`http://127.0.0.1:8000/api/favorites/search/?username=${searchUsername}`);
      setSearchResult(res.data);
      setSearchMessage(res.data.favorites.length === 0 ? "User found, but they have no favorites." : "");
    } catch (err) {
      console.error(err.response.data);
      setSearchResult(null);
      setSearchMessage(`❌ ${err.response.data.error || "User not found"}`);
    }
  };

  // --- Styles ---
  const containerStyle = {
    minHeight: "100vh",
    backgroundColor: "#0d0d0d",
    color: "white",
    padding: "40px",
    backgroundImage: "url('https://images4.alphacoders.com/126/thumb-1200-1264065.png')",
    backgroundSize: "cover",
  };
  const sectionStyle = {
    backgroundColor: "rgba(26, 26, 26, 0.9)",
    padding: "25px",
    borderRadius: "12px",
    border: "1px solid #e63946",
    marginBottom: "30px",
    maxWidth: "700px",
  };
  const h2Style = { color: "#ff4655", borderBottom: "1px solid #ff4655", paddingBottom: "10px" };
  const inputStyle = {
    width: "100%", padding: "10px", marginBottom: "15px", borderRadius: "5px",
    border: "1px solid #ff4655", background: "#1a1a1d", color: "white",
  };
  const buttonStyle = {
    backgroundColor: "#e63946", color: "white", border: "none",
    padding: "10px 20px", borderRadius: "8px", cursor: "pointer", fontSize: "16px"
  };
  const cardStyle = {
    margin: "5px", border: "2px solid #e63946", borderRadius: "10px",
    padding: "10px", textAlign: "center", width: "120px", backgroundColor: "#1a1a1a",
  };
  // --------------

  if (loading) return <div style={containerStyle}>Loading Profile...</div>;

  return (
    <div style={containerStyle}>
      <Link to="/home" style={{ color: "#e63946", fontWeight: "bold", textDecoration: "none" }}>
        &lt; Back to Agents
      </Link>
      <h1 style={{ color: "#ff4655" }}>Profile Page</h1>

      {/* --- 1. My Profile Info --- */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>My Info</h2>
        <h3>Username: <span style={{ color: "#06d6a0" }}>{profile?.username}</span></h3>
        <h3>Agents Favorited: <span style={{ color: "#06d6a0" }}>{profile?.favorites_count}</span></h3>
      </div>

      {/* --- 2. Change Password --- */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>Update Password</button>
          {passwordMessage.text && (
            <p style={{ color: passwordMessage.type === "error" ? "#ff4655" : "#06d6a0" }}>
              {passwordMessage.text}
            </p>
          )}
        </form>
      </div>

      {/* --- 3. Search Other Users --- */}
      <div style={sectionStyle}>
        <h2 style={h2Style}>Search Other Users' Favorites</h2>
        <form onSubmit={handleSearchUser} style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Enter username..."
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value)}
            style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
            required
          />
          <button type="submit" style={buttonStyle}>Search</button>
        </form>

        {searchMessage && <p>{searchMessage}</p>}
        
        {searchResult && searchResult.favorites.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3 style={{ color: '#06d6a0' }}>{searchResult.username}'s Favorites:</h3>
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              {searchResult.favorites.map(fav => {
                const agentData = allAgents[fav.agent_uuid];
                return agentData ? (
                  <Link key={fav.id} to={`/agent/${fav.agent_uuid}`} state={{ from: 'profile' }}>
                    <div style={cardStyle}>
                      <img src={agentData.displayIcon} alt={agentData.displayName} width="80" style={{ borderRadius: '5px' }} />
                      <p style={{ fontWeight: "bold", fontSize: '14px', margin: '5px 0 0' }}>{agentData.displayName}</p>
                    </div>
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}