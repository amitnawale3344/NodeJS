const http = require("http");
const express = require("express");
const path = require("path");

var MongoClient = require("mongodb").MongoClient;
const app = express();
app.use(express.json());
app.use(express.static("express"));
// default URL for website
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});


app.post("/bio-update", function (req, res) {
  console.log("bio-update=========> start");
  var userObj = req.body;
  var response = res;
  
  var url = "mongodb://admin:secret@localhost:27017";
  let mongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };

  MongoClient.connect(url, mongoClientOptions,function (err, client) {
    if (err) throw err;

    var db = client.db("user-account");
    userObj["userid"] = 1;

    var query = { userid: 1 };
    var newValues = { $set: userObj };

    console.log("Successfully connect to mongo db");

    db.collection("user").updateOne(
      query,
      newValues,
      { upsert: true },
      function (err, res) {
        if (err) throw err;
        console.log("Successfully updated.");
        client.close();        
      }
    );
  });

  response.send(userObj); 
});

const server = http.createServer(app);
const port = 8082;
server.listen(port);
console.debug("Server listening on port " + port);
