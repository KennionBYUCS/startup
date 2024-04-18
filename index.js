const cookieParser = require('cookie-parser');
//const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./database.js');

const authCookieName = 'token';

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Use the cookie parser middleware for tracking authentication tokens
app.use(cookieParser());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// Trust headers that are forwarded from the proxy so we can determine IP addresses
app.set('trust proxy', true);

// CreateAuth token for a new user
apiRouter.post('/auth/create', async (req, res) => {
  if (await DB.getUser(req.body.username)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body.username, req.body.password);

    // Set the cookie
    setAuthCookie(res, user.token);

    res.send({
      id: user._id,
    });
  }
});

// GetAuth token for the provided credentials
apiRouter.post('/auth/login', async (req, res) => {
  const user = await DB.getUser(req.body.username);
  if (user) {
    // bcrypt not used due to compilation error, ask David Bauch for confirmation
    if (req.body.password === user.password) {
    //if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// DeleteAuth token if stored in cookie
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie(authCookieName);
  res.status(204).end();
});

// GetUser returns information about a user
apiRouter.get('/user/:email', async (req, res) => {
  const user = await DB.getUser(req.params.username);
  if (user) {
    const token = req.cookies.token;
    res.send({ username: user.username, authenticated: token === user.token });
    return;
  }
  res.status(404).send({ msg: 'Unknown' });
});

apiRouter.get('/scores/global', async (_req, res) => {
  const scores = await DB.getGlobalScores();
  res.send(scores);
});

apiRouter.get('/shape', async (req, res) => {
  const shape = await DB.getShape(req.body.username);
  res.send(shape);
});

apiRouter.post('/shape', async (req, res) => {
  if (req.body.username === "Guest") {
    res.send(shape);
    return;
  }

  const shape = await DB.addShape({type : req.body.type, username: req.body.username});
  res.send(shape);
});

// secureApiRouter verifies credentials for endpoints
var secureApiRouter = express.Router();
apiRouter.use(secureApiRouter);

secureApiRouter.use(async (req, res, next) => {
  authToken = req.cookies[authCookieName];
  const user = await DB.getUserByToken(authToken);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

secureApiRouter.get('/scores/personal', async (_req, res) => {
  const scores = await DB.getPersonalScores();
  res.send(scores);
});

secureApiRouter.post('/score/personal', async (req, res) => {
  const personalScore = {username : req.body.username, shape : req.body.shape, accuracy: req.body.accuracy};
  await DB.addPersonalScore(personalScore);
  const personalScores = await DB.getPersonalScores();
  res.send(personalScores);
});

secureApiRouter.post('/score/global', async (req, res) => {
  const globalScore = {username : req.body.username, shape : req.body.shape, accuracy: req.body.accuracy};
  await DB.addGlobalScore(globalScore);
  const globalScores = await DB.getGlobalScores();
  res.send(globalScores);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// setAuthCookie in the HTTP response
function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

// Default error handler
app.use(function (err, req, res, next) {
  res.status(500).send({ type: err.name, message: err.message });
});
