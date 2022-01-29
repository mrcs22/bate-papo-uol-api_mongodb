import dayjs from "dayjs";
import * as db from "../database.js";

async function saveNew({ from, text, type, to }) {
  const timestamp = dayjs().format("HH:mm:ss");

  const participantsCollection = await db.getCollection("participants");
  const participant = await participantsCollection.findOne({ name: to });
  if (!participant) {
    return false;
  }

  const messagesCollection = await db.getCollection("messages");

  const message = {
    text,
    from,
    type: type || "status",
    to: to || "Todos",
    time: timestamp,
  };

  await messagesCollection.insertOne(message);
  await db.closeConnection();
  return true;
}

export { saveNew };
