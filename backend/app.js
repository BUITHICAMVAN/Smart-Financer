const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./db/db'); 
const { readdirSync } = require('fs');
const cookieParser = require('cookie-parser')
require('dotenv').config(); //library to get what inside .env

const PORT = process.env.PORT || 3000; // Provide a default value for PORT

require('./models/associateModel')

app.use(express.json());
app.use(cors());

app.use(cookieParser()) // extract access_token out of cookies

// Setup base URL for API and load routes dynamically
readdirSync('./routes').forEach((route) => {
    app.use('/api/v1', require(`./routes/${route}`));
});

// Connect to db and start server
// Just start the server, the db pool will manage connections as needed
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});