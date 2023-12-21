const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

const uploadRoutes = require('./routes/upload');
const resumeRoutes = require('./routes/resume');


app.use(bodyParser.json());
app.use(cors());

app.use('/api', uploadRoutes);
app.use('/api', resumeRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
