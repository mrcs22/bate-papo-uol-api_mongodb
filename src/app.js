import "./setup.js";
import express, { json } from "express";
import cors from "cors";

import * as participantsController from "./controllers/participantsController.js";
import * as messagesController from "./controllers/messagesController.js";

const app = express();
app.use(json());
app.use(cors());

app.post("/participants", participantsController.signIn);
app.post("/messages", messagesController.saveNew);

export default app;
