import express, {Request, Response} from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ACCESS_TOKEN, DATA_URL } from '../config/env';
import axios from 'axios';
import { renderHtml } from '../utils/renderHtml';
import { accessToken } from './auth.routes';
import TransactionModel from "../database/models/Transaction";
import AccountsModel from "../database/models/Account";

// const accessToken = ACCESS_TOKEN;
const dataRouter = express.Router();
let accountId = ""

dataRouter.get(
    '/accounts',
    asyncHandler(async (req: Request, res: Response) => {
        if (!accessToken) {
            res.status(401).send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
            return;
        }

        const url = `${DATA_URL}/accounts`
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });

        try {
            const data = new AccountsModel({
                results: response.data.results,
                status: response.data.status,
            });
            await data.save();

        } catch (error) {
            console.log(response.data)
            console.error("Error saving data:", error);
            res.status(500).json({ error: "Failed to store data" });
        }

        res.json(response.data);
        accountId = response.data.results[0]?.account_id
    })
);

dataRouter.get(
    '/balance',
    asyncHandler(async (req: Request, res: Response) => {
        if (!accessToken) {
            res.status(401).send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
            return;
        }

        const url = `${DATA_URL}/accounts/${accountId}/balance`
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });

        res.json(response.data);
    })
);

dataRouter.get(
    '/transactions',
    asyncHandler(async (req: Request, res: Response) => {
        if (!accessToken) {
            res.status(401).send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
            return;
        }

        const url = `${DATA_URL}/accounts/${accountId}/transactions`
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });

        try {
            const data = new TransactionModel({
                results: response.data.results,
                status: response.data.status,
            });
            await data.save();

        } catch (error) {
            console.log(response.data)
            console.error("Error saving data:", error);
            res.status(500).json({ error: "Failed to store data" });
        }

        res.json(response.data);
    })
);

dataRouter.get(
    '/transactions/pending',
    asyncHandler(async (req: Request, res: Response) => {
        if (!accessToken) {
            res.status(401).send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
            return;
        }

        const url = `${DATA_URL}/accounts/${accountId}/transactions/pending`
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });

        res.json(response.data);
    })
);

dataRouter.get(
    '/standing_orders',
    asyncHandler(async (req: Request, res: Response) => {
        if (!accessToken) {
            res.status(401).send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
            return;
        }

        const url = `${DATA_URL}/accounts/${accountId}/standing_orders`
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });

        res.json(response.data);
    })
);

dataRouter.get(
    '/direct_debits',
    asyncHandler(async (req: Request, res: Response) => {
        if (!accessToken) {
            res.status(401).send(renderHtml('Error', 'Access token is missing. Please authenticate again.', '/connect'));
            return;
        }

        const url = `${DATA_URL}/accounts/${accountId}/direct_debits`
        const response = await axios.get(url, {
            headers: {Authorization: `Bearer ${accessToken}`},
        });

        res.json(response.data);
    })
);

export { dataRouter };
