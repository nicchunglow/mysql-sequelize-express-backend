require("dotenv").config();
require("../src/utils/db");
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Started Express app on http://localhost:${PORT}/`)
);
