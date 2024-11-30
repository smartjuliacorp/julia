require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();

// TrueLayer OAuth2 credentials
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PROVIDERS = process.env.PROVIDERS;
// const AUTH_URL = 'https://auth.truelayer.com/';
const AUTH_URL = 'https://auth.truelayer-sandbox.com/';
const TOKEN_URL = 'https://auth.truelayer.com/connect/token';
const DATA_URL = 'https://api.truelayer.com/data/v1/';

let accessToken = '';

// Step 1: Redirect user to TrueLayer authorization page
app.get('/connect', (req, res) => {
    const authUrl = `${AUTH_URL}?response_type=code&client_id=${CLIENT_ID}&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=${REDIRECT_URI}&providers=${PROVIDERS}`;
    res.redirect(authUrl);
});

// Step 2: Handle OAuth2 callback and exchange authorization code for access token
app.get('/callback', async (req, res) => {
    const code = req.query.code;
    console.log(`## code: ${code}`)

    try {
        const response = await axios.post(TOKEN_URL, {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: code
        }, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        accessToken = response.data.access_token;
        console.log(`## accessToken: ${accessToken}`);
        res.send('Authentication successful! Now fetch your account data.');
    } catch (error) {
        console.error('Error fetching tokens:', error);
        console.log('## error_details: ', error.response.data.error_details)
        res.status(500).send('Failed to authenticate.');
    }
});

// Step 3: Fetch account data using the access token
app.get('/accounts', async (req, res) => {
    try {
        const response = await axios.get(`${DATA_URL}accounts`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching account data:', error);
        res.status(500).send('Failed to fetch account data.');
    }
});

// Run the server on port 3000
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
