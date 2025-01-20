import express, { Request, Response, NextFunction } from 'express';
import { authRouter } from './routes/auth.routes';
import { dataRouter } from './routes/data.routes';
import { brainRouter } from './routes/brain.routes';
import { renderHtml } from './utils/renderHtml';
import { DB_USER, DB_PASSWORD, DB_NAME } from "./config/env"
import mongoose from "mongoose";

const MONGO_URI = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@julia.7umal.mongodb.net/${DB_NAME}?authMechanism=DEFAULT`

mongoose.set("debug", true);
mongoose.connect(MONGO_URI)

mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
});

const app = express();

// Mount routers
app.use(authRouter);
app.use(dataRouter);
app.use(brainRouter);

// Global error-handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled error:', err.stack || err.message);
    res.status(500).send(renderHtml('Error', 'An unexpected error occurred.'));
});

export { app }; // Export the app instance for testing

// Start the server
if (require.main === module) {
    const PORT: number = parseInt(process.env.PORT || '3000', 10);
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}