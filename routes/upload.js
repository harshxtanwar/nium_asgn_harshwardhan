const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/uploadResumeDetails', async (req, res) => {
    try {
      const { name, currentJobTitle, currentJobDescription, currentJobCompany } = req.body;
  
      // Validate required fields
      
      if (!name || !currentJobTitle || !currentJobDescription || !currentJobCompany) {
        return res.status(400).json({ error: 'Bad request. Missing required fields.' });
      }
  
      // Split the full name into first name and last name
      const [firstName, lastName] = name.split(' ');
  
      if (!firstName || !lastName) {
        return res.status(400).json({ error: 'Bad request. Both first name and last name are required.' });
      }
  
      // Create a new resume entry in the database
      const result = await pool.query(
        'INSERT INTO resumes (first_name, last_name, current_job_title, current_job_description, current_job_company) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [firstName, lastName, currentJobTitle, currentJobDescription, currentJobCompany]
      );
  
      const resumeId = result.rows[0].id;
  
      res.status(200).json({ resumeId });
    } catch (error) {
      console.error('Error processing the request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  


module.exports = router;
