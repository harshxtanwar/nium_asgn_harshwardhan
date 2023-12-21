// src/ResumeApp.js
import React, { useState } from 'react';
import axios from 'axios';

const ResumeApp = () => {
  const [name, setName] = useState('');
  const [searchname, setSearchName] = useState('');
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentJobDescription, setCurrentJobDescription] = useState('');
  const [currentJobCompany, setCurrentJobCompany] = useState('');
  const [resumeId, setResumeId] = useState(null);
  const [searchResult, setSearchResult] = useState(null);

  const handleUpload = async () => {
    console.log('react name input', name);

    try {
      const response = await axios.post('http://localhost:8080/api/uploadResumeDetails', {
        'name':name,
        'currentJobTitle':currentJobTitle,
        'currentJobDescription':currentJobDescription,
        'currentJobCompany':currentJobCompany,
      });

      console.log('Response from server:', response.data);

      setResumeId(response.data.resumeId);
      alert(`Resume uploaded successfully. Resume ID: ${response.data.resumeId}`);
    } catch (error) {
      console.error('Error uploading resume:', error.response.data.error);
      alert('Error uploading resume. Please check the console for details.');
    }
    
  };

  const handleSearchByName = async () => {
    try {
      const formattedName = searchname.replace(' ', '+'); // Replace spaces with '+'
      console.log('React name input', formattedName);
      const response = await axios.get(`http://localhost:8080/api/getResumeByName/${formattedName}`);
  
      setSearchResult(response.data);
    //   alert('Resume(s) found. Check the console for details.');
    } catch (error) {
      console.error('Error searching by name:', error.response ? error.response.data.error : error.message);
      alert('Error searching by name. Please check the console for details.');
    }
  };

  const handleSearchById = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/getResumeById/${resumeId}`);
      setSearchResult(response.data);  // Assuming the data property is present in a successful response
    //   alert('Resume found. Check the console for details.');
    } catch (error) {
      console.error('Error searching by ID:', error.response ? error.response.data.error : error.message);
      alert('Error searching by ID. Please check the console for details.');
    }
  };
  

  return (
    <div>
      <h1>Resume Application</h1>
      <div>
        <h2>Upload Resume</h2>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Current Job Title" value={currentJobTitle} onChange={(e) => setCurrentJobTitle(e.target.value)} />
        <input type="text" placeholder="Current Job Description" value={currentJobDescription} onChange={(e) => setCurrentJobDescription(e.target.value)} />
        <input type="text" placeholder="Current Job Company" value={currentJobCompany} onChange={(e) => setCurrentJobCompany(e.target.value)} />
        <button onClick={handleUpload}>Upload Resume</button>
      </div>

      <div>
        <h2>Search Resume</h2>
        <input type="text" placeholder="Name" value={searchname} onChange={(e) => setSearchName(e.target.value)} />
        <button onClick={handleSearchByName}>Search by Name</button>
      </div>

      <div>
        <h2>Search by ID</h2>
        <input type="text" placeholder="Resume ID" value={resumeId} onChange={(e) => setResumeId(e.target.value)} />
        <button onClick={handleSearchById}>Search by ID</button>
      </div>

      <div>
        <h2>Search Result</h2>
        <pre>{JSON.stringify(searchResult, null, 2)}</pre>
      </div>
    </div>
  );
};

export default ResumeApp;
