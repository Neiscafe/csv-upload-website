import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import {port} from './server-config'

const app = express();

app.use(bodyParser.json());

export default app;

const PORT = process.env.PORT || port;

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});