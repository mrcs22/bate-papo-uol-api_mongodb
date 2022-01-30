import * as messageSchema from "../schemas/messageSchema.js";
import sanitizeString from "./helpers/sanitizeString.js";
import * as messagesService from "../services/messagesService.js";

async function saveNew(req, res) {
  const from = sanitizeString(req.headers.user);

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

async function get(req, res) {
  const user = sanitizeString(req.headers.user);

  const { limit } = req.query;
  const parsedLimit = parseInt(limit);

  const isLimitDefined = limit !== undefined;
  const isInvalidLimit = isNaN(parsedLimit) || parsedLimit < 1;

  if (isLimitDefined && isInvalidLimit) {
    return res.sendStatus(400);
  }

  if (!user) {
    return res.sendStatus(401);
  }

  try {
    const messages = await messagesService.get(user, parsedLimit);

    res.send(messages);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
}
export { saveNew, get };
