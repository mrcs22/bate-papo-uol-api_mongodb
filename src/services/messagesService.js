import dayjs from "dayjs";
import getDbAgent from "../database.js";

async function saveNew({ from, text, type = "status", to = "Todos" }) {
  const timestamp = dayjs().format("HH:mm:ss");

  const participantsCollection = await getDbAgent().getCollection(
    "participants"
  );
  const participant = await participantsCollection.findOne({ name: to });

  const isItNotPublicMessage = to !== "Todos";

  if (isItNotPublicMessage && !participant) {
    return false;
  }

  const messagesCollection = await getDbAgent().getCollection("messages");

  const message = {
    text,
    from,
    type,
    to,
    time: timestamp,
  };

  await messagesCollection.insertOne(message);
  await getDbAgent().closeConnection();
  return true;
}
async function get(userName, limit) {
  const messagesCollection = await getDbAgent().getCollection("messages");

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

  await getDbAgent().closeConnection();
  return messages.reverse();
}

export { saveNew, get };
