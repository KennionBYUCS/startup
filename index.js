const express = require('express');
const app = express();

// The service port. In production the front-end code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 4000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the front-end static content hosting
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetScores
apiRouter.get('/scores', (_req, res) => {
  res.send(personalScoreboard);
});

// SubmitScore
apiRouter.post('/score', (req, res) => {
  personalScoreboard = updateScores(req.body, personalScoreboard);
  res.send(personalScoreboard);
});

apiRouter.get('/shape', (_req, res) => {
    res.send(shape);
});

apiRouter.post('/shape', (req, res) => {
    shape = updateShape(req.body);
    res.send(shape);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// globalScoreboard exists here as a placeholder for when websocket logic is implemented
let globalScoreboard = [];
let personalScoreboard = [];

function updateScores(newScore, scores) {
  let found = false;
  for (const [i, prevScore] of scores.entries()) {
    if (newScore.accuracy > prevScore.accuracy) {
      scores.splice(i, 0, newScore);
      found = true;
      break;
    }
  }

  if (!found) {
    scores.push(newScore);
  }

  if (scores.length > 12) {
    scores.length = 12;
  }

  return scores;
}

let shape = {type: "", sides: -1, focal: -1}
function updateShape(newShape) {
    shape.type = newShape.type;
    shape.sides = parseInt(newShape.sides);
    shape.focal = parseFloat(newShape.focal);

    return shape;
}
