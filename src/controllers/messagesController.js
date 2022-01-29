import * as messageSchema from "../schemas/messageSchema.js";
import sanitizeString from "./helpers/sanitizeString.js";
import * as messagesService from "../services/messagesService.js";

async function saveNew(req, res) {
  const from = req.headers.user;

  const sanitizedMessageText = sanitizeString(req.body.text);

  const message = {
    ...req.body,
    text: sanitizedMessageText,
    from,
  };

  try {
    const validation = messageSchema.saveNew.validate(message);

    if (!!validation.error) {
      return res.sendStatus(422);
    }

    const saveMessageSuccess = await messagesService.saveNew(message);

    if (!saveMessageSuccess) {
      return res.sendStatus(422);
    }

    res.sendStatus(201);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}

export { saveNew };
