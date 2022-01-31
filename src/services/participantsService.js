import getDbAgent from "../database.js";
import * as messagesService from "./messagesService.js";

async function signIn(name) {
  const lowerCaseName = name.toLowerCase();

  const participantsCollection = await getDbAgent().getCollection(
    "participants"
  );

  const participant = await participantsCollection.findOne({
    name: lowerCaseName,
  });

  if (!!participant) {
    await getDbAgent().closeConnection();
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

  await getDbAgent().closeConnection();

  return true;
}

async function getAll() {
  const participantsCollection = await getDbAgent().getCollection(
    "participants"
  );

  const participants = await participantsCollection
    .find({})
    .project({ lastStatus: 0 })
    .toArray();

  await getDbAgent().closeConnection();
  return participants;
}

async function updateStatus(name) {
  const participantsCollection = await getDbAgent().getCollection(
    "participants"
  );

  const participant = await participantsCollection.findOne({ name });

  if (!participant) {
    return false;
  }

  await participantsCollection.updateOne(
    { name },
    { $set: { lastStatus: Date.now() } }
  );

  await getDbAgent().closeConnection();
  return true;
}

async function removeOfflineOnes() {
  try {
    const participantsCollection = await getDbAgent().getCollection(
      "participants"
    );

    const lowestAllowedStatusTime = Date.now() - 10000;

    const offlineUsers = await participantsCollection
      .find({ lastStatus: { $lt: lowestAllowedStatusTime } })
      .toArray();

    for (const { name } of offlineUsers) {
      await participantsCollection.deleteOne({ name });

      await messagesService.saveNew({
        from: name,
        text: "sai da sala...",
      });
    }

    getDbAgent().closeConnection();
  } catch (e) {
    console.log(e);
  }
}

export { signIn, getAll, updateStatus, removeOfflineOnes };
