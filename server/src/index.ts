import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import characterRoutes from "./routes/characters.js";
import premiumTimeRoutes from "./routes/premiumTime.js";
import tibiaCoinRoutes from "./routes/tibiaCoin.js";
import farmGoalRoutes from "./routes/farmGoal.js";
import dashboardRoutes from "./routes/dashboard.js";
import huntRoutes from "./routes/hunts.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const allowedOrigins = process.env.CORS_ORIGIN?.split(",").map((value) => value.trim());
const hasAllowedOrigins = Boolean(allowedOrigins && allowedOrigins.length > 0);
const corsOptions: cors.CorsOptions = {
  origin: hasAllowedOrigins
    ? (origin, callback) => {
        if (!origin || allowedOrigins?.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Origin não permitida pelo CORS"));
      }
    : "*",
  credentials: hasAllowedOrigins,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/characters", characterRoutes);
app.use("/premium-time", premiumTimeRoutes);
app.use("/tibia-coin", tibiaCoinRoutes);
app.use("/farm-goal", farmGoalRoutes);
app.use("/hunts", huntRoutes);
app.use("/dashboard", dashboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Rota não encontrada.", path: req.path });
});

app.listen(port, () => {
  console.log(`API rodando na porta ${port}`);
});
