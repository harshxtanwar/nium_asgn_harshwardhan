// src/ResumeApp.js
import React, { useState } from 'react';
import axios from 'axios';
import './ResumeApp.css'; // Import the CSS file for styling

const ResumeApp = () => {
  const [name, setName] = useState('');
  const [searchname, setSearchName] = useState('');
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentJobDescription, setCurrentJobDescription] = useState('');
  const [currentJobCompany, setCurrentJobCompany] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const handleUpload = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/uploadResumeDetails', {
        'name': name,
        'currentJobTitle': currentJobTitle,
        'currentJobDescription': currentJobDescription,
        'currentJobCompany': currentJobCompany,
      });

      setResumeId(response.data.resumeId);
      alert(`Resume uploaded successfully. Resume ID: ${response.data.resumeId}`);
    } catch (error) {
      console.error('Error uploading resume:', error.response.data.error);
      alert('Error uploading resume. Please check the console for details.');
    }
  };

  const handleSearchByName = async () => {
    try {
      const formattedName = searchname.replace(' ', '+');
      const response = await axios.get(`http://localhost:8080/api/getResumeByName/${formattedName}`);

      setSearchResult(response.data);
    } catch (error) {
      console.error('Error searching by name:', error.response ? error.response.data.error : error.message);
      alert('Error searching by name. Please check the console for details.');
    }
  };

  const handleSearchById = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getResumeById/${resumeId}`);
      setSearchResult(response.data);
    } catch (error) {
      console.error('Error searching by ID:', error.response ? error.response.data.error : error.message);
      alert('Error searching by ID. Please check the console for details.');
    }
  };

  return (
    <div className="resume-app-container">
      <h1>Resume Application</h1>

      <div className="upload-section">
        <h2>Upload Resume</h2>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Current Job Title:</label>
          <input type="text" value={currentJobTitle} onChange={(e) => setCurrentJobTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Current Job Description:</label>
          <input type="text" value={currentJobDescription} onChange={(e) => setCurrentJobDescription(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Current Job Company:</label>
          <input type="text" value={currentJobCompany} onChange={(e) => setCurrentJobCompany(e.target.value)} />
        </div>
        <button onClick={handleUpload}>Upload Resume</button>
      </div>

      <div className="search-section">
        <h2>Search Resume</h2>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" value={searchname} onChange={(e) => setSearchName(e.target.value)} />
        </div>
        <button onClick={handleSearchByName}>Search by Name</button>
      </div>

      <div className="search-section">
        <h2>Search by ID</h2>
        <div className="form-group">
          <label>Resume ID:</label>
          <input type="text" value={resumeId} onChange={(e) => setResumeId(e.target.value)} />
        </div>
        <button onClick={handleSearchById}>Search by ID</button>
      </div>

      <div className="search-result">
        <h2>Search Result</h2>
        <pre>{JSON.stringify(searchResult, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ResumeApp;
