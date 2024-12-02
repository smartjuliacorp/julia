import express, { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { DATA_URL } from '../config/env';
import axios from 'axios';
import { renderHtml } from '../utils/renderHtml';
import { accessToken } from './auth.routes';

const dataRouter = express.Router();

dataRouter.get(
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

export { dataRouter };
