const app = require('./app')
const mongoose = require('mongoose');

const {DB_PATH} = process.env;

mongoose.connect(DB_PATH)
.then(() => {
  console.log("Database connection successful");
  app.listen(3000, () => {
    console.log("Server running. Use our API on port: 3000")
  })
})
.catch ((err) => {
  console.log(err.message);
  process.exit(1);
  }
)
