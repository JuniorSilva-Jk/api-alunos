import express, { response } from "express";
import dotenv from "dotenv";
import connectDatabase from "./database/db.js";

import userRoute from "./routes/users.route.js";
import authRoute from "./routes/auth.route.js";
import newsRoute from "./routes/news.route.js";
import swaggerRoute from "./routes/swagger.route.cjs";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/news", newsRoute);
app.use("/doc", swaggerRoute);

connectDatabase();
app.listen(port, () => {
  console.log(`Back-end iniciado na porta ${port}`);
});
