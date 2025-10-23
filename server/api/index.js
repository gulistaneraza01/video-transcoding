import express from "express";
import client from "./src/routes/client.js";
import cors from "cors";

const app = express();

const port = process.env.PORT || 3000;

app.use(cors({ origin: "*" }));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1", client);

app.listen(port, () => {
  console.log(`Server Listening On PORT: ${port}`);
});
