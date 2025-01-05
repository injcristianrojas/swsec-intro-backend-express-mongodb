import express from 'express';
import cors from 'cors';
import { startDB } from './helpers/mdb.mjs';
import { exec } from 'node:child_process';

const PORT = 9000;
const app = express();

app.use(express.json());
app.use(cors({
  origin: '*',
  methods: '*'
}));

import swaggerUi from 'swagger-ui-express';

var options = {
  swaggerOptions: {
      url: "/api-docs/swagger.json",
  },
}
app.get("/api-docs/swagger.json", (_, res) => res.json(swaggerDocument));
app.use('/api-docs', swaggerUi.serveFiles(null, options), swaggerUi.setup(null, options));

app.get("/", (_, res) => {
  res.json({ "message": "Index. Nothing to see here." })
});

app.get('/healthcheck/:file?', (req, res) => {
  const file = req.params.file ? req.params.file : 'healthcheck';

  let command = `cat ${file}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the command: ${error}`);
      return res.status(500).send('Internal Server Error');
    }
    if (stderr) {
      console.error(`Script returned an error: ${stderr}`);
      return res.status(500).send('Script Error');
    }
    res.json({
      "status": stdout
    });
  });
});

startDB();

app.listen(PORT, () => {
  console.log("API server running on port 9000");
});

import v1router from './routes/v1.mjs';
import v2router from './routes/v2.mjs';
app.use('/api/v1', v1router);
app.use('/api/v2', v2router);

export default app;
