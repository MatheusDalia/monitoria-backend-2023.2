import Express, { json } from "express";
import { authRouter } from "./routes/auth.js";
import dotenv from "dotenv";
import { userRouter } from "./routes/user.js";

dotenv.config();

const app = Express();
app.use(json());

app.use("/user", userRouter);

app.use("/auth", authRouter);

app.post("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("App is running ");
});
