const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

// Placeholder for API routes
app.get('/api/v1', (req, res) => {
  res.json({ message: 'Welcome to the FreelanceFlow API!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
