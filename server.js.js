const express = require('express');

const path = require('path');

const app = express();

// Serve static assets
app.use(express.static(__dirname));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname,'src', 'index.html'));
});
const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});