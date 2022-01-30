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

  await participantsCollection.insertOne({
    name: lowerCaseName,
    lastStatus: Date.now(),
  });

  await messagesService.saveNew({
    from: lowerCaseName,
    text: "entra na sala...",
  });

  await db.closeConnection();

  return true;
}

async function getAll() {
  const participantsCollection = await db.getCollection("participants");

  const participants = await participantsCollection
    .find({})
    .project({ lastStatus: 0 })
    .toArray();

  await db.closeConnection();
  return participants;
}

export { signIn, getAll };
