import * as participantSchema from "../schemas/participantSchema.js";
import sanitizeString from "./helpers/sanitizeString.js";
import * as participantsService from "../services/participantsService.js";

async function signIn(req, res) {
  const name = sanitizeString(req.body.name);

  try {
    const validation = participantSchema.signIn.validate({ name });

    if (!!validation.error) {
      return res.sendStatus(422);
    }

    const signInSuccess = await participantsService.signIn(name);

    if (!signInSuccess) {
      return res.sendStatus(409);
    }

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function getAll(req, res) {
  try {
    const participants = await participantsService.getAll();
    res.send(participants);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

async function updateStatus(req, res) {
  const name = sanitizeString(req.headers.user);
  const isInvalidName = name === "";

  if (isInvalidName) {
    return res.sendStatus(400);
  }

  try {
    const statusUpdateSuccess = await participantsService.updateStatus(name);

    if (!statusUpdateSuccess) {
      return res.sendStatus(404);
    }

    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export { signIn, getAll, updateStatus };
