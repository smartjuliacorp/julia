/**
 * TrueLayer example to fetch user data account using the access token
 */

require('dotenv').config();
const axios = require('axios');
const express = require('express');

const app = express();

// Validate environment variables
const requiredEnv = ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI', 'AUTH_API', 'DATA_API', 'PROVIDERS'];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

// Environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_API = process.env.AUTH_API;
const DATA_API = process.env.DATA_API;
const PROVIDERS = process.env.PROVIDERS;

const AUTH_URL = `https://${AUTH_API}`;
const TOKEN_URL = `https://${AUTH_API}/connect/token`;
const DATA_URL = `https://${DATA_API}/data/v1`;

let accessToken = ''; // Store access token in memory for simplicity

/**
 * Render a styled HTML page.
 * @param {string} title - Page title.
 * @param {string} message - Main content message.
 * @param {string} [link] - Optional link for the user.
 * @returns {string} - Rendered HTML string.
 */
const renderHtml = (title, message, link = null) => `
    <html>
        <head>
            <title>${title}</title>
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
            <h1>${title}</h1>
            <p>${message}</p>
            ${link ? `<a href="${link}">Click here</a>` : ''}
        </body>
    </html>
`;

/**
 * Step 1: Redirect user to the TrueLayer authorization page.
 */
app.get('/connect', (req, res) => {
    const authUrl = `${AUTH_URL}/?response_type=code&client_id=${CLIENT_ID}&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=${REDIRECT_URI}&providers=${PROVIDERS}`;
    res.redirect(authUrl);
});

/**
 * Step 2: Handle OAuth2 callback and exchange authorization code for an access token.
 */
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).send(renderHtml('Error', 'Missing authorization code.'));
    }

    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('redirect_uri', REDIRECT_URI);
        params.append('code', code);

        const response = await axios.post(TOKEN_URL, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        accessToken = response.data.access_token;
        console.log('Access token received:', accessToken);

        res.send(
            renderHtml(
                'Authentication Successful',
                'Now you are able to fetch your account data.',
                '/accounts'
            )
        );
    } catch (error) {
        console.error('Error fetching tokens:', error.response?.data || error.message);
        res.status(500).send(renderHtml('Error', 'Failed to authenticate.'));
    }
});

/**
 * Step 3: Fetch account data using the access token.
 */
app.get('/accounts', async (req, res) => {
    if (!accessToken) {
        return res
            .status(401)
            .send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
    }

    try {
        const response = await axios.get(`${DATA_URL}/accounts`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching account data:', error.response?.data || error.message);
        res.status(500).send(renderHtml('Error', 'Failed to fetch account data.'));
    }
});

/**
 * Run the server on port.
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});