import { Link } from "react-router-dom";

export default function Landing() {
  const buttonStyle = {
    backgroundColor: "#e63946",
    color: "white",
    border: "none",
    padding: "12px 25px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    margin: "10px",
    transition: "transform 0.2s, box-shadow 0.2s",
  };

  const buttonHover = {
    transform: "scale(1.05)",
    boxShadow: "0px 0px 15px #e63946",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0d0d0d",
        backgroundImage:
          "url('https://images2.alphacoders.com/135/1356853.jpeg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        color: "white",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
        Valorant Agent Tracker
      </h1>
      <p style={{ fontSize: "18px", marginBottom: "40px" }}>
        Keep track of your favorite Valorant agents!
      </p>

      <div>
        <Link to="/login">
          <button
            style={buttonStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, buttonHover)
            }
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            Login
          </button>
        </Link>
        <Link to="/register">
          <button
            style={buttonStyle}
            onMouseEnter={(e) =>
              Object.assign(e.currentTarget.style, buttonHover)
            }
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
          >
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
