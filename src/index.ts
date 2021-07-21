import express from "express";
import { Request, Response, NextFunction } from "express";
import * as http from "http";
import * as logger from "./models/logs";
import errorhandler from "errorhandler";
import { ResponseObj } from "./models/models";
import { DB } from "./models/db";
var expressValidator = require("express-validator");
import * as Socket from "./socket/socket";
import passport from "passport";
import BearerStrategy from "passport-http-bearer";
import * as Token from "./models/accesstoken";
import * as Users from "./models/users";
import path from "path";
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;
export const mongodbURI: string =
  process.env.MONGO_DB_URI || "mongodb://localhost:27017/jbpoc";
const db = new DB();
const LABEL = process.env.SERVICE_NAME || "BK_SERVICE";

app.set("port", port);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Express Validator
app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      var namespace = param.split("."),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += "[" + namespace.shift() + "]";
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// init socket
export const io = require("socket.io")(server);
Socket.init(io);

// development only
if ("development" === app.get("env")) {
  logger.info(
    logger.DEFAULT_MODULE,
    null,
    "Running in Development Environment ."
  );
  app.use(errorhandler());
}

app.use(passport.initialize());

// Bring in the database!
db.connectWithRetry(mongodbURI);

// passport strategy
passport.use(
  new BearerStrategy.Strategy(function (token, done) {
    //logger.debug("Passport Token: " + token);
    Token.findByToken(token, function (err: Error, tokenFromDb: any) {
      if (err) {
        let responseObj = new ResponseObj(401, "Unauthorized", undefined);
        return done(err, false, responseObj.toJsonString());
      }
      if (!tokenFromDb) {
        let responseObj = new ResponseObj(401, "Unauthorized", undefined);
        return done(null, false, responseObj.toJsonString());
      }
      Users.findById(tokenFromDb.userId, function (err: Error, user: any) {
        if (err) {
          let responseObj = new ResponseObj(401, "Unauthorized!", undefined);
          return done(err, false, responseObj.toJsonString());
        }
        if (!user) {
          let responseObj = new ResponseObj(401, "Unauthorized!", undefined);
          return done(null, false, responseObj.toJsonString());
        }
        return done(null, user, { scope: "all", message: LABEL });
      });
    });
  })
);

//allow requests from any host
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Authorization, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST,PUT, DELETE");
  next();
});

//Routes
app.use("/v1/test", (req, res, next) => {
  return res.status(200).send("Jumpersbow API's are live");
});
app.use("/v1/auth", require("./routes/auth"));
app.use("/v1", require("./routes/v1"));
//server static files
app.use(express.static("public"));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/../public/index.html"));
// });

// START THE SERVER
server.listen(port, () => {
  console.log(LABEL + " is running on port " + port);
});

//catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  res.status(404).send("Page/Api Not Found");
  return;
});

process.on("SIGINT", function () {
  process.exit(0);
});

process.on("SIGTERM", function () {
  process.exit(0);
});

module.exports = app;
