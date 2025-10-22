import express from "express";
import client from "./src/routes/client.js";

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/v1", client);

app.listen(port, () => {
  console.log(`Server Listening On PORT: ${port}`);
});
