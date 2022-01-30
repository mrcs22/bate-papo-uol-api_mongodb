import "./setup.js";
import express, { json } from "express";
import cors from "cors";

import * as participantsController from "./controllers/participantsController.js";
import * as messagesController from "./controllers/messagesController.js";

const app = express();
app.use(json());
app.use(cors());

app.post("/participants", participantsController.signIn);
app.get("/participants", participantsController.getAll);

app.post("/messages", messagesController.saveNew);
app.get("/messages", messagesController.get);

export default app;
