const app = require('./app');
const { port } = require('./config/env');

app.listen(port, () => {
  console.log(`Life RPG API running on port ${port}`);
});
