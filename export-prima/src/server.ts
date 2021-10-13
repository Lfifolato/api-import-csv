import express from "express";
import { router } from "./routes";
import cors from "cors";

const app = express();
app.use(express.static("public"));

app.use(router);
app.use(cors);
app.listen(3333, () => console.log("Server ir running"));
