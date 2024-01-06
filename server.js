const app = require("./app");

const PORT = 3001;

module.exports = app.listen(PORT, () => {
  console.log(`Server running. Use our API on port: ${PORT}`);
});
