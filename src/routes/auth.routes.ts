import express, { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, AUTH_URL, TOKEN_URL, PROVIDERS, SCOPE } from '../config/env';
import axios from 'axios';
import { renderHtml } from '../utils/renderHtml';

let accessToken = '';

const authRouter = express.Router();

authRouter.get(
    '/connect',
    (req: Request, res: Response) => {
        const authUrl = `${AUTH_URL}/?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPE}&redirect_uri=${REDIRECT_URI}&providers=${PROVIDERS}`;
        res.redirect(authUrl);
    }
);

authRouter.get(
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

export { authRouter, accessToken };
