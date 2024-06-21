import express from "express";
import env from "dotenv";
import dbs from "./database/dbs.js";
import userRoutes from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import productsRoute from "./routes/productsRoute.js";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
env.config();
const app = express();
const port = process.env.PORT || 8000;
// connect to database
dbs();
// cors
app.use(cors({
    origin: [
        "https://ecommerce-frontend-phi.vercel.app",
        "*",
        "http://localhost:5173",
        "https://ecommerce-frontend-phi.vercel.app",
        "https://ecommerce-frontend-phi.vercel.app/",
        "https://ecommerce-frontend-phi.vercel.app/login",
        "https://ecommerce-frontend-git-main-technonbs-projects.vercel.app",
        process.env.FRONTEND_URL,
    ],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    credentials: true,
}));
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
app.listen(port, () => {
    console.log(`App is listening at port ${port}`);
});
