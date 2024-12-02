import * as dotenv from 'dotenv';
import axios, { AxiosError } from 'axios';
import express, { Request, Response, NextFunction } from 'express';

dotenv.config();

const app = express();

// Validate environment variables
const requiredEnv = ['CLIENT_ID', 'CLIENT_SECRET', 'REDIRECT_URI', 'AUTH_API', 'DATA_API', 'PROVIDERS'];
requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
});

// Environment variables
const CLIENT_ID: string = process.env.CLIENT_ID!;
const CLIENT_SECRET: string = process.env.CLIENT_SECRET!;
const REDIRECT_URI: string = process.env.REDIRECT_URI!;
const AUTH_API: string = process.env.AUTH_API!;
const DATA_API: string = process.env.DATA_API!;
const PROVIDERS: string = process.env.PROVIDERS!;

const AUTH_URL = `https://${AUTH_API}`;
const TOKEN_URL = `https://${AUTH_API}/connect/token`;
const DATA_URL = `https://${DATA_API}/data/v1`;

let accessToken = ''; // Store access token in memory for simplicity

/**
 * Render a styled HTML page.
 * @param title - Page title.
 * @param message - Main content message.
 * @param link - Optional link for the user.
 * @returns Rendered HTML string.
 */
const renderHtml = (title: string, message: string, link?: string): string => `
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
 * Async handler to catch and forward errors in async routes.
 * @param fn - Async function to wrap.
 * @returns Wrapped function.
 */
const asyncHandler = (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Step 1: Redirect user to the TrueLayer authorization page.
 */
app.get(
    '/connect',
    (req: Request, res: Response) => {
        const authUrl = `${AUTH_URL}/?response_type=code&client_id=${CLIENT_ID}&scope=info%20accounts%20balance%20cards%20transactions%20direct_debits%20standing_orders%20offline_access&redirect_uri=${REDIRECT_URI}&providers=${PROVIDERS}`;
        res.redirect(authUrl);
    }
);

/**
 * Step 2: Handle OAuth2 callback and exchange authorization code for an access token.
 */
app.get(
    '/callback',
    asyncHandler(async (req: Request, res: Response) => {
        const code = req.query.code as string;

        if (!code) {
            res.status(400).send(renderHtml('Error', 'Missing authorization code.'));
            return;
        }

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('redirect_uri', REDIRECT_URI);
        params.append('code', code);

        const response = await axios.post(TOKEN_URL, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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
    })
);

/**
 * Step 3: Fetch account data using the access token.
 */
app.get(
    '/accounts',
    asyncHandler(async (req: Request, res: Response) => {
        if (!accessToken) {
            res.status(401).send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
            return;
        }

        const response = await axios.get(`${DATA_URL}/accounts`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        res.json(response.data);
    })
);

/**
 * Global error-handling middleware.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err.stack || err.message);
    res.status(500).send(renderHtml('Error', 'An unexpected error occurred.'));
});

/**
 * Run the server on the specified port.
 */
const PORT: number = parseInt(process.env.PORT || '3000', 10);
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
