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
  }
}

export { signIn };
