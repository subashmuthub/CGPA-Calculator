const express = require('express');
const app = express();
const port = 3001;

app.get('/test', (req, res) => {
  res.json({ message: 'Simple test server is working!' });
});

app.listen(port, () => {
  console.log(`Simple test server running on port ${port}`);
});