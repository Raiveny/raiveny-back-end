const app = require('./app');

const port = process.env.PORT || 5000;
app.listen(process.env.PORT || 5000, () => {
  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
