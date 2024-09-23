import express from "express";
import env from "dotenv";
import dbs from "./database/dbs.js";
import userRoutes from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import productsRoute from "./routes/productsRoute.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import payment from "./routes/paymentRoute.js";
env.config();
const app = express();
const port = process.env.PORT || 8000;
// connect to database
dbs();
// cors
app.use(cors({
    origin: [
        "https://scatch-ecommerce.vercel.app/",
        "https://scatch-ecommerce.vercel.app",
        "http://localhost:5173",
        process.env.FRONTEND_URL,
    ],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    credentials: true,
}));
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
// middlewares
app.use(express.static("/src/public"));
app.use(cookieParser());
app.use(express.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.get("/", (req, res) => {
    res.send("Hello World");
});
// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/product", productsRoute);
app.use("/api/v1", payment);
app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});
