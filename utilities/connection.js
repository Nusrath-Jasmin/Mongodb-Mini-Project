const mongoose = require("mongoose");

module.exports = (app) => {
  // connect with mongodb and make app listenable from browser
  mongoose
    .connect(
      "mongodb://localhost:27017/project"
        ? "mongodb://localhost:27017/project"
        : ""
    )
    .then((data) => {
      app.listen(process.env.PORT || 4000);
      console.log("server started");
    })
    .catch((err) => {
      console.log(err);
    });
};
