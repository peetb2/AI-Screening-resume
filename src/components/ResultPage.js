// src/components/ResultPage.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state || {};
  const { name, email, skills, score } = data;

  // If user opens /results directly with no data
  if (!name && !email && !score) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #6a11cb, #2575fc)",
          color: "#fff",
        }}
      >
        <div
          style={{
            background: "#fff",
            color: "#333",
            padding: "30px 40px",
            borderRadius: "12px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            textAlign: "center",
          }}
        >
          <h2>No result data</h2>
          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              borderRadius: "6px",
              border: "none",
              background: "#6a11cb",
              color: "white",
              cursor: "pointer",
            }}
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6a11cb, #2575fc)",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "30px 50px",
          borderRadius: "16px",
          boxShadow: "0 15px 30px rgba(0,0,0,0.25)",
          maxWidth: "600px",
          width: "100%",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
          AI Resume Screening Results
        </h2>

        <p>
          <strong>Name:</strong> {name}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Skills:</strong>{" "}
          {Array.isArray(skills) ? skills.join(", ") : skills}
        </p>

        <p>
          <strong>Resume Score:</strong> {score}%
        </p>

        <p style={{ marginTop: "15px" }}>
          <strong>Status:</strong>{" "}
          <span style={{ color: "#2e7d32", fontWeight: "bold" }}>
            {score >= 70 ? "Shortlisted" : "Not Shortlisted"}
          </span>
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 18px",
            borderRadius: "8px",
            border: "none",
            background: "#6a11cb",
            color: "white",
            cursor: "pointer",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Upload another resume
        </button>
      </div>
    </div>
  );
};

export default ResultPage;
