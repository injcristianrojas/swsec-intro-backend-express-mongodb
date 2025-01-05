import { MongoClient } from "mongodb";

const DBNAME = "swsec-intro";
const USERSTABLE = "users";
const MESSAGESTABLE = "messages";

async function client() {
  try {
    const client = new MongoClient("mongodb://localhost:27017/");
    await client.connect();
    const db = client.db(DBNAME);
    return db;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function startDB() {
  const db = await client();
  db.dropDatabase();

  db.collection(USERSTABLE).insertMany([
    { username: "zorzal", password: "fio", type: 2 },
    { username: "admin", password: "dt356wss212l", type: 1 },
    { username: "chincol", password: "fiofio", type: 2 },
  ]);
  db.collection(MESSAGESTABLE).insertMany([
    { message: "Bienvenidos al foro de Fans de las Aves Chilenas. Soy el Administrador."},
    { message: "Se informa que la API se encuentra deshabilitada hasta nuevo aviso." }
  ]);
}

async function getMessages() {
  const db = await client();
  const results = await db.collection(MESSAGESTABLE).find({}, { projection: {message:1, _id:0}}).toArray();
  return results;
}

async function loginQuery(username, password) {
  const db = await client();
  const payload = {
    username: username,
    password: password
  }
  const results = await db.collection(USERSTABLE).find(payload).toArray();
  return results;
}

async function getUsersByTypeV1(usertype) {
  const db = await client();
  const results = await db.collection(USERSTABLE).find({type: { $eq: +usertype }}, { projection: {_id:0, password:0} }).toArray();
  return results;
}

async function getUsersByTypeV2(usertype) {
  const db = await client();
  const results = await db.collection(USERSTABLE).find({type: +usertype}).toArray();
  return results;
}

async function addMessage(message) {
  const db = await client();
  await db.collection(MESSAGESTABLE).insertOne({message: message});
}

export { client as default, startDB, getMessages, loginQuery, getUsersByTypeV1, getUsersByTypeV2, addMessage, DBNAME, USERSTABLE, MESSAGESTABLE };
