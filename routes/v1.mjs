import express from 'express';
import { getMessages, getUsersByTypeV1 } from '../helpers/mdb.mjs';

const router = express.Router();

router.get("/users/type/:type", async (req, res) => {
  res.json(await getUsersByTypeV1(req.params.type));
});

router.get("/messages", async (req, res) => {
  res.json(await getMessages());
});

export default router;
