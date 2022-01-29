import * as db from "../database.js";
import * as messagesService from "./messagesService.js";

async function signIn(name) {
  const lowerCaseName = name.toLowerCase();

  const participantsCollection = await db.getCollection("participants");

  const participant = await participantsCollection.findOne({
    name: lowerCaseName,
  });

  if (!!participant) {
    await db.closeConnection();
    return false;
  }

  await participantsCollection.insertOne({ name: lowerCaseName });

  await messagesService.save({ from: lowerCaseName, text: "entra na sala..." });

  await db.closeConnection();

  return true;
}

export { signIn };
