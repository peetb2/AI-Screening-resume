// src/components/UploadResume.js
import React, { useState } from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadResume = ({ onAddCandidate }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [score, setScore] = useState(null);

  const navigate = useNavigate();

  const S3_BUCKET = "resume-screening-upload-bu-2";
  const REGION = "us-east-1";
  const API_ENDPOINT = "https://vtbxvnaqo1.execute-api.us-east-1.amazonaws.com/pord/ResumeParser";

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;

    try {
      // 1) Upload to S3
      const uploadUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${fileName}`;

      await axios.put(uploadUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });

      // 2) Call scoring API (API Gateway -> Lambda)
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bucket: S3_BUCKET,
          key: fileName,
        }),
      });

      if (!response.ok) {
        throw new Error(`Scoring API status ${response.status}`);
      }

      const rawData = await response.json();

      // If API Gateway wraps Lambda response, data is inside body
      const parsed =
        rawData && typeof rawData.body === "string"
          ? JSON.parse(rawData.body)
          : rawData || {};

      const result = {
        id: Date.now(),
        name: parsed.name || parsed.Name || "Unknown",
        email: parsed.email || parsed.Email || "Not found",
        skills: parsed.skills || parsed.Skills || [],
        score: parsed.score ?? parsed.Score ?? 0,
      };

      setScore(result.score);

      // Add to candidate list in App.js (if callback provided)
      if (onAddCandidate) {
        onAddCandidate(result);
      }

      // Navigate to results page with data
      navigate("/results", { state: result });
    } catch (error) {
      console.error("Upload or scoring failed", error);
      alert("Upload or scoring failed: " + (error.message || "see console"));
    }

    setUploading(false);
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "text/plain": [".txt"],
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #6a11cb",
        padding: "20px",
        textAlign: "center",
        borderRadius: "10px",
        background: "#f5f5f5",
        margin: "20px auto",
        width: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="h6">Drag & Drop your resume here (.txt)</Typography>

      {file ? (
        <Typography
          variant="body2"
          sx={{ marginTop: "10px", fontWeight: "bold", color: "#333" }}
        >
          {file.name}
        </Typography>
      ) : (
        <Button
          onClick={open}
          sx={{
            marginTop: "10px",
            background: "#6a11cb",
            color: "white",
            "&:hover": { background: "#2575fc" },
          }}
        >
          Select File
        </Button>
      )}

      {file && (
        <Button
          onClick={handleUpload}
          sx={{
            marginTop: "15px",
            background: "#ff9800",
            color: "white",
            "&:hover": { background: "#e65100" },
          }}
          disabled={uploading}
        >
          {uploading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Upload & Score"
          )}
        </Button>
      )}

      {score !== null && (
        <Typography
          variant="h6"
          sx={{ marginTop: "20px", color: "#2e7d32" }}
        >
          Resume Score: {score}
        </Typography>
      )}
    </Box>
  );
};

export default UploadResume;
