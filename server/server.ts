import './env';

import * as Pusher from 'pusher';
import * as express from 'express';
import * as compression from 'compression';
import * as cors from 'cors';
import * as path from 'path';

import { createGame, isGameOver, revealTile, setFlag } from '../src/minesweeper';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  encrypted: true
});

const staticFilesBaseDir = process.cwd() + '/dist/minesweeper-party';

const app = express();

const predefinedGames = {
  easy: { cols: 10, rows: 16, mines: 10 },
  medium: { cols: 10, rows: 16, mines: 30 },
  hard: { cols: 10, rows: 20, mines: 60 },
  extreme: { cols: 10, rows: 30, mines: 90 }
};

const games = {};

app.use(cors({ maxAge: 300 }));
app.use(compression());
app.use(express.json());
app.use(express.static(staticFilesBaseDir));

app.get('/game/:channel([A-Za-z0-9]{1,20})', function (req, res) {
  const { channel } = req.params;

  if (games[channel]) {
    return res.json(games[channel]);
  }

  if (predefinedGames[channel]) {
    games[channel] = createGame(predefinedGames[channel]);
  } else {
    games[channel] = createGame(predefinedGames.medium);
  }

  return res.json(games[channel]);
});

app.post('/game/:channel([A-Za-z0-9]{1,20})/reveal', function (req, res) {
  const { channel } = req.params;
  const { tile } = req.body;

  const game = games[channel];

  if (!game || isGameOver(game)) {
    return;
  }

  pusher.trigger(channel, 'reveal', { tile });

  const newGame = games[channel] = revealTile(game, tile);

  if (isGameOver(newGame)) {
    delete games[channel];
  }

  res.json();
});

app.post('/game/:channel([A-Za-z0-9]{1,20})/flag', function (req, res) {
  const { channel } = req.params;
  const { tile, flag } = req.body;

  const game = games[channel];

  if (!game || isGameOver(game)) {
    return;
  }

  pusher.trigger(channel, 'flag', { tile, flag });

  games[channel] = setFlag(game, tile, flag);

  res.json();
});

app.post('/game/:channel([A-Za-z0-9]{1,20})/reveal', function (req, res) {
  const { channel } = req.params;
  const { tile } = req.body;

  const game = games[channel];

  if (!game || isGameOver(game)) {
    return;
  }

  pusher.trigger(channel, 'reveal', { tile });

  const newGame = games[channel] = revealTile(game, tile);

  if (isGameOver(newGame)) {
    delete games[channel];
  }

  res.json();
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(staticFilesBaseDir + '/index.html'));
});

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log(`Listening on port ${listener.address().port}`);
});

process.on('SIGINT', function () {
  app.close();
  process.exit();
});
