const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = 8080;

// Replace the following connection string with your PostgreSQL connection string
const connectionString = 'postgresql://postgres:root@localhost:5432/nium_db';
const pool = new Pool({
  connectionString: connectionString,
});

app.use(bodyParser.json());
app.use(cors());


app.post('/api/uploadResumeDetails', async (req, res) => {
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

app.get('/api/getResumeById/:id', async (req, res) => {
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
app.get('/api/getResumeByName/:name', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});