import express, { Request, Response } from "express";
import "dotenv/config";
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
import order from "./routes/orderRoute.js";

const app = express();
const port = process.env.PORT || 8000;

// connect to database
dbs();

// cors
app.use(
  cors({
    origin: [
      "https://scatch-ecommerce.vercel.app/",
      "https://scatch-ecommerce.vercel.app",
      "http://localhost:5173",
      process.env.FRONTEND_URL!,
    ],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    credentials: true,
  })
);
app.use(helmet());
app.use(compression());
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// middlewares
app.use(express.static("/src/public"));
app.use(cookieParser());

app.use(express.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

// routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/product", productsRoute);
app.use("/api/v1", payment);
app.use("/api/v1", order);

app.listen(port, () => {
  console.log(`App is listening at port ${port}`);
});
