const app = require('./app');

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server Running On PORT ${PORT}`);
});
