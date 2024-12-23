import fs from "fs";
import OpenAI from "openai";
import {asyncHandler} from "../utils/asyncHandler";
import {OPENAI_API_KEY} from "../config/env"
import express, {Request, Response} from "express";
import path from "path"

const brainRouter = express.Router();

// Initialize OpenAI with your API key
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

// Load the JSON file
const bankHistoryPath = path.resolve(__dirname, "../mock/mock_bank_history.json")
const bankHistory = JSON.parse(fs.readFileSync(bankHistoryPath, "utf-8"));

// Create a prompt for the OpenAI API
const prompt = `
Analyze the provided bank history and calculate the total amount spent on transport-related expenses. Additionally, provide insights into spending patterns within this category, including frequency of transactions and any notable trends.

Here is the bank history in JSON format:
${JSON.stringify(bankHistory, null, 2)}
`;

// Define the route
brainRouter.get(
    "/brain",
    asyncHandler(async (req: Request, res: Response) => {
        try {
            // Request completion from OpenAI
            const result = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {role: "user", content: prompt},
                ],
                temperature: 1,
                max_completion_tokens: 2048,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            });

            // Extract and send the insights content
            const insights = result.choices[0].message.content;
            res.json({insights});
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({error: "Failed to process the bank history insights."});
        }
    })
);

export {brainRouter};
