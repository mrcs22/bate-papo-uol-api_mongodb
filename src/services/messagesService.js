import dayjs from "dayjs";
import * as db from "../database.js";

async function saveNew({ from, text, type = "status", to = "Todos" }) {
  const timestamp = dayjs().format("HH:mm:ss");

  const participantsCollection = await db.getCollection("participants");
  const participant = await participantsCollection.findOne({ name: to });

  const isItNotStatusMessage = type !== "status";

  if (isItNotStatusMessage && !participant) {
    return false;
  }

  const messagesCollection = await db.getCollection("messages");

  const message = {
    text,
    from,
    type: type,
    to: to,
    time: timestamp,
  };

  await messagesCollection.insertOne(message);
  await db.closeConnection();
  return true;
}
async function get(userName, limit) {
  const messagesCollection = await db.getCollection("messages");

  const queryConditions = [
    { from: userName },
    { to: userName },
    { to: "Todos" },
    { type: "message" },
  ];

  const messages = await messagesCollection
    .find({
      $or: queryConditions,
    })
    .limit(limit || 0)
    .sort({ _id: -1 })
    .toArray();

  await db.closeConnection();
  return messages;
}

export { saveNew, get };
