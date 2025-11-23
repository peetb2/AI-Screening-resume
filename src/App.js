// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadResume from './components/UploadResume';
import CandidateTable from './components/CandidateTable';
import Notifications from './components/Notifications';
import AboutPage from './components/AboutPage';
import ResultPage from './components/ResultPage';
import './App.css';

function App() {
  const [candidates, setCandidates] = useState([]);

  // Load from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem("candidates");
    if (saved) {
      try {
        setCandidates(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved candidates", e);
      }
    }
  }, []);

  // Save to localStorage whenever candidates change
  useEffect(() => {
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }, [candidates]);

  const handleAddCandidate = (candidate) => {
    setCandidates((prev) => [...prev, candidate]);
  };

  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <UploadResume onAddCandidate={handleAddCandidate} />
                  <CandidateTable candidates={candidates} />
                  <Notifications />
                </>
              }
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/results" element={<ResultPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
