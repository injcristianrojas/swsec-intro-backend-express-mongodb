import express from 'express';
import { loginQuery, getMessages, getUsersByTypeV2, addMessage } from '../helpers/mdb.mjs';
import { isTokenValid, signToken } from '../helpers/jwt.mjs';
const router = express.Router();

router.post("/login", async (req, res) => {
  let results = await loginQuery(req.body.username, req.body.password);

  if (results.length < 1) {
    res.status(401).json({ "error": "unauthorized" });
  } else {
    res.json({ 'token': signToken(req.body.username) });
  }
});

router.get("/users/type/:type", async (req, res) => {
  if (!isTokenValid(req)) {
    res.status(401).json({ "error": "unauthorized" });
    return;
  }

  res.json(await getUsersByTypeV2(req.params.type));

});

router.get("/messages", async (req, res) => {
  if (!isTokenValid(req)) {
    res.status(401).json({ "error": "unauthorized" });
    return;
  }

  res.json(await getMessages());

});

router.post("/messages/add", async (req, res) => {
  if (!isTokenValid(req)) {
    res.status(401).json({ "error": "unauthorized" });
    return;
  }

  await addMessage(req.body.message);

  res.json({
    "message": "success",
    "data": await getMessages()
  });

});

export default router;
