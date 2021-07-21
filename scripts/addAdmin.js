var mongoose = require("mongoose");
require("dotenv").config();
var User = require("../lib/models/users");

const mongodbURI =
  process.env.MONGO_DB_URI ||
  "mongodb+srv://appAdmin:CyTsBUlhQ76ZWVo4@cluster0.zbvd8.mongodb.net/jbpoc";

const userList = [
  {
    userId: "admin@123.com",
    name: "admin",
    password: "jumper@123"
  }
];

try {
  if (mongodbURI == null || mongodbURI == undefined) {
    console.log("Can't read configuration");
    process.exit(-1);
  }
} catch (ex) {
  console.log("Can't read configuration: " + ex);
  process.exit(-1);
}

mongoose.connect(
  mongodbURI,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    bufferMaxEntries: 0,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
  },
  function (err, db) {
    console.log("Starting ...");
    addUserList(() => {
      setTimeout(() => {
        db.close();
      }, userList.length * 2000);
    });
  }
);

async function addUserList(cb) {
  var totalExpected = userList.length;
  var itr = 0;
  var total = 0;

  // for (var i = 0; i < userList.length; i++ ) {
  // let element = userList[i];
  userList.forEach((element) => {
    // console.log("before wait... " + itr + ", " + total);
    // do {
    // console.log("waiting... " + itr + ", " + total);
    // wait(3000);
    // } while (itr < total);
    // console.log("after wait... " + itr + ", " + total);

    const user = new User.UserModel(element);
    // console.log("new user model ready.");
    User.createSaltedPassword(user.password, function (err, hashedPassword) {
      if (err) {
        console.log(err);
        return;
      }

      // console.log("Password encrypted..");
      user.password = hashedPassword;
      User.findByUserId(element.userId, function (err, dbUser) {
        if (err) {
          console.log("failed for : " + element.userId);
          total++;
          if (total == totalExpected) {
            cb();
          }
        } else {
          // console.log(".");
          if (!dbUser) {
            User.createUser(user, function (err, r) {
              if (err) {
                console.log(
                  "failed " + element.userId + " : " + err.toString()
                );
              } else {
                console.log("added " + element.userId);
              }

              total++;
              if (total == totalExpected) {
                cb();
              }
            });
          } else {
            var userJson = JSON.parse(JSON.stringify(user));
            delete userJson._id;
            delete userJson.createdAt;
            User.updateUserById(element.userId, userJson, function (err, r) {
              if (err) {
                console.log(
                  "failed " + element.userId + " : " + err.toString()
                );
              } else {
                console.log("updated " + element.userId);
              }

              total++;
              if (total == totalExpected) {
                cb();
              }
            });
          }
        }
      });
    });
  });
}
