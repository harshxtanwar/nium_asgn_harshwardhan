const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/getResumeById/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Retrieve the resume from the database by ID
      const result = await pool.query('SELECT * FROM resumes WHERE id = $1', [id]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Resume not found' });
      }
  
      const resumeDetails = result.rows[0];
      res.status(200).json(resumeDetails);
    } catch (error) {
      console.error('Error processing the request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
// GET request to retrieve resumes by name
router.get('/getResumeByName/:name', async (req, res) => {
    try {
      const { name } = req.params;
  
      // Decode the URL-encoded name
      const decodedName = decodeURIComponent(name);
  
      // Split the decoded name into first name and last name
      const [firstName, lastName] = decodedName.split('+');
  
      // Validate required fields
      if (!firstName || !lastName) {
        return res.status(400).json({ error: 'Bad request. Both first name and last name are required.' });
      }
  
      // Retrieve resumes from the database by matching both first name and last name
      const result = await pool.query(
        'SELECT * FROM resumes WHERE first_name = $1 AND last_name = $2',
        [firstName, lastName]
      );
  
      // If no matches found, retrieve resumes with matches for first name and last name independently
      if (result.rows.length === 0) {
        const independentMatches = await pool.query(
          'SELECT * FROM resumes WHERE first_name = $1 OR last_name = $2',
          [firstName, lastName]
        );
  
        res.status(200).json(independentMatches.rows);
      } else {
        res.status(200).json(result.rows);
      }
    } catch (error) {
      console.error('Error processing the request:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;
