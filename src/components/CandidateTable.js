// src/components/CandidateTable.js
import React from "react";
import "./CandidateTable.css";

const CandidateTable = ({ candidates = [] }) => {
  return (
    <div className="table-container">
      <table className="candidate-table">
        <thead>
          <tr>
            <th>Candidate ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Skills</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {candidates.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty-row">
                No candidates yet
              </td>
            </tr>
          ) : (
            candidates.map((c) => (
              <tr key={c.id} className="table-row">
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td
                  className="skills-cell"
                  title={
                    Array.isArray(c.skills) ? c.skills.join(", ") : c.skills
                  }
                >
                  {Array.isArray(c.skills) ? c.skills.join(", ") : c.skills}
                </td>
                <td>{c.score}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
