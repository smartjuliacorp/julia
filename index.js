/**
 * TrueLayer example to get user accessToken
 */
require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_API = process.env.AUTH_API;
const DATA_API = process.env.DATA_API;
const PROVIDERS = process.env.PROVIDERS;

/**
 * TrueLayer OAuth2 credentials
 */
const AUTH_URL = `https://${AUTH_API}`;
const TOKEN_URL = `https://${AUTH_API}/connect/token`;
const DATA_URL = `https://${DATA_API}/data/v1`;

let accessToken = '';

/**
 * Step 1: Use TrueLayer authorization page then, redirect to callback url when success.
 */
app.get('/connect', (req, res) => {
    const authUrl = `${AUTH_URL}/?response_type=code&client_id=${CLIENT_ID}&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=${REDIRECT_URI}&providers=${PROVIDERS}`;
    res.redirect(authUrl);
});

/**
 * Step 2: Handle OAuth2 callback and exchange authorization code for access token
 */
app.get('/callback', async (req, res) => {
    const code = req.query.code;
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
        res.send(`
            <html>
                <head>
                    <title>Authentication Successful</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            text-align: center;
                            padding: 50px;
                            background-color: #f9f9f9;
                        }
                        h1 {
                            color: #4CAF50;
                        }
                        p {
                            font-size: 18px;
                            color: #555;
                        }
                        a {
                            text-decoration: none;
                            color: #007BFF;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <h1>Authentication Successful!</h1>
                    <p>Now you are able to fetch your account data.</p>
                    <a href="/accounts">Click here to fetch your account data</a>
                </body>
            </html>
        `);
        
    } catch (error) {
        console.error('Error fetching tokens:', error);
        console.log('## error_details: ', error.response.data.error_details)
        res.status(500).send('Failed to authenticate.');
    }
});

/**
 * Step 3: Fetch account data using the access token
 */
app.get('/accounts', async (req, res) => {
    try {
        const response = await axios.get(`${DATA_URL}/accounts`, {
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

/**
 * Run the server on port 3000
 */
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
