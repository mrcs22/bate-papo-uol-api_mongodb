import dayjs from "dayjs";
import * as db from "../database.js";

async function save(from, text, type, to) {
  const timestamp = dayjs().format("HH:mm:ss");

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
}

export { save };
