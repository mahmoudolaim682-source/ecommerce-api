import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import { xss } from "express-xss-sanitizer";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));
app.use(morgan("dev"));
app.use(cookieParser(process.env.COOKIE_SECRET || "cookie-secret"));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp({ whitelist: ['price','category','brand','sort','fields','page','limit'] }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again later" }
});
app.use("/api", limiter);

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);

app.all("*", (req, res) => {
    res.status(404).json({ success: false, message: "This route does not exist" });
});

app.use(globalErrorHandler);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("Database Connected & Secured");
        app.listen(PORT, () => {
            console.log(`The server is running on http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        process.exit(1);
    });