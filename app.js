const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./helpers/error-handler");
const cookieParser = require("cookie-parser");

require("dotenv/config");
app.use(cookieParser());

// app.use(cors());
// app.options("*", cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://snippet-manager-test.netlify.app",
    ],
    credentials: true,
  })
);

//Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(errorHandler);

//Routers
const usersRouter = require("./routers/users");
const snippetRouter = require("./routers/snippets");
const snippetTags = require("./routers/snippetTags");

const api = process.env.API_URL;
app.use(`${api}/users`, usersRouter);
app.use(`${api}/snippets`, snippetRouter);
app.use(`${api}/snippetTags`, snippetTags);

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port:${PORT}`);
});
