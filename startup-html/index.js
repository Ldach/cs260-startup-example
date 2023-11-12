const express = require('express');
const app = express();

// The service port. In production the frontend code is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// JSON body parsing using built-in middleware
app.use(express.json());

// Serve up the frontend static content hosting
app.use(express.static('public'));

// Router for service endpoints
const apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetScores
apiRouter.get('/layouts', (_req, res) => {
  res.send(layouts);
});

// SubmitScore
apiRouter.post('/layout', (req, res) => {
  layouts = updateLayouts(req.body, layouts);
  res.send(layouts);
});

// Return the application's default page if the path is unknown
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

let layouts = [];
function updateLayouts(newLayout, layouts) {
  let found = false;
  for (const [i, prevLayout] of layouts.entries()) {
    if (newLayout.name === prevLayout.name) {
      layouts.splice(i, 0, newLayout);
      found = true;
      break;
    }
  }

  if (!found) {
    layouts.push(newLayout);
  }

  if (layouts.length > 10) {
    layouts.length = 10;
  }

  return layouts;
}