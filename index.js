//          $$\    $$\  $$$$$$\  $$$$$$$\   $$$$$$\
//          $$ |   $$ |$$  __$$\ $$  __$$\ $$  __$$\
//          $$ |   $$ |$$ /  $$ |$$ |  $$ |$$ /  \__|
//          \$$\  $$  |$$ |  $$ |$$$$$$$  |\$$$$$$\
//           \$$\$$  / $$ |  $$ |$$  ____/  \____$$\
//            \$$$  /  $$ |  $$ |$$ |      $$\   $$ |
//             \$  /    $$$$$$  |$$ |      \$$$$$$  |
//              \_/     \______/ \__|       \______/
//
//        CheatBreaker Cosmetics API created by ItsVops
//         https://github.com/ItsVops/CB-Cosmetics-API
//

var express = require("express");
var app = express();
var fs = require("fs");
var request = require("request");
var config = require("./config.json");
var { exit } = require("process");

function rawBody(req, res, next) {
  req.setEncoding("utf8");
  req.rawBody = "";
  req.on("data", function (chunk) {
    req.rawBody += chunk;
  });
  req.on("end", function () {
    next();
  });
}

app.use(rawBody);

// CHEATBREAKER REQUESTS (PLAYER, TOGGLE, SERVERS) START
app.get("/player/:uuid", async function (req, res) {
  // Show Player Data
  const uuid = req.params.uuid;
  const userPath = "users/" + uuid + ".json";
  if (!fs.existsSync(userPath)) {
    res.send({ uuid: uuid, cosmetics: {} });
    return;
  }
  var playerData = fs.readFileSync(userPath);
  var obj = JSON.parse(playerData);
  res.send(obj);
});

app.post("/player/:uuid/cosmetics/:cosmetic/toggle", async function (req, res) {
  // Toggle Player Cosmetic
  var uuid = req.params.uuid;
  var cosmetic = req.params.cosmetic;
  var userPath = "users/" + uuid + ".json";
  var file = require("./users/" + uuid + ".json");
  var body = req.rawBody;
  if (body != "true") {
    //holy shit i was tired
    if (body != "false") {
      res.send({ success: false, errMsg: "body is not a boolean" });
      return;
    }
  }
  file.cosmetics[cosmetic].active = body == "true";
  fs.writeFileSync(userPath, JSON.stringify(file, null, 2));
  res.send({ success: true });
});

app.get("/servers", async function (req, res) {
  // Show Pinned Servers
  var obj = JSON.parse(fs.readFileSync("servers.json"));
  res.send(obj);
});
// CHEATBREAKER REQUESTS (PLAYER, TOGGLE, SERVERS) END

// ADMIN PANEL DISPLAY & FUNCTIONS START
app.use(`/${config.secret}/panel`, express.static("panel")); // show panel HTML

app.get(`/${config.secret}/panel/addCape`, async function (req, res) {
  // addcape function (should have made this 1 function with wings but whatever)
  var username = req.query.username;
  var cape = req.query.cape;
  var uuid;
  request(
    "https://api.ashcon.app/mojang/v2/user/" + username,
    function (error, response, body) {
      try {
        var json = JSON.parse(body);
      } catch (err) {}
      if (!json) return res.send({ success: false });
      if (!json.uuid) return res.send({ success: false });
      uuid = json.uuid;
      var userPath = "users/" + uuid + ".json";
      if (!fs.existsSync(userPath)) {
        var obj = { uuid: uuid, cosmetics: {} };
        let data = JSON.stringify(obj, null, 2);
        fs.writeFileSync(userPath, data);
      }
      fs.readFile(userPath, function (err, data) {
        var json = JSON.parse(data);
        json.cosmetics[cape] = {
          active: false,
          name: cape,
          resourceLocation: cape,
          scale: 0.16,
          type: "cape",
        };
        let newCape = JSON.stringify(json, null, 2);
        fs.writeFileSync(userPath, newCape);
      });
      res.send({ success: true });
    }
  );
});

app.get(`/${config.secret}/panel/addWings`, async function (req, res) {
  // add wings
  var username = req.query.username;
  var wings = req.query.wings;
  var uuid;
  request(
    "https://api.ashcon.app/mojang/v2/user/" + username,
    function (error, response, body) {
      try {
        var json = JSON.parse(body);
      } catch (err) {}
      if (!json) return res.send({ success: false });
      if (!json.uuid) return res.send({ success: false });
      uuid = json.uuid;
      var userPath = "users/" + uuid + ".json";
      if (!fs.existsSync(userPath)) {
        var obj = { uuid: uuid, cosmetics: {} };
        let data = JSON.stringify(obj, null, 2);
        fs.writeFileSync(userPath, data);
      }
      fs.readFile(userPath, function (err, data) {
        var json = JSON.parse(data);
        json.cosmetics[wings] = {
          active: false,
          name: wings,
          resourceLocation: wings,
          scale: 0.14,
          type: "dragon_wings",
        };
        let newWings = JSON.stringify(json, null, 2);
        fs.writeFileSync(userPath, newWings);
      });
      res.send({ success: true });
    }
  );
});

app.get(`/${config.secret}/panel/delCape`, async function (req, res) {
  // del cape
  var username = req.query.username;
  var cape = req.query.cape;
  var uuid;
  request(
    "https://api.ashcon.app/mojang/v2/user/" + username,
    function (error, response, body) {
      try {
        var json = JSON.parse(body);
      } catch (err) {}
      if (!json) return res.send({ success: false });
      if (!json.uuid) return res.send({ success: false });
      uuid = json.uuid;
      var userPath = "users/" + uuid + ".json";
      if (!fs.existsSync(userPath)) return res.send({ success: false });
      fs.readFile(userPath, function (err, data) {
        var json = JSON.parse(data);
        delete json.cosmetics[cape];
        let newCape = JSON.stringify(json, null, 2);
        fs.writeFileSync(userPath, newCape);
      });
      res.send({ success: true });
    }
  );
});

app.get(`/${config.secret}/panel/delWings`, async function (req, res) {
  // add wings
  var username = req.query.username;
  var wings = req.query.wings;
  var uuid;
  request(
    "https://api.ashcon.app/mojang/v2/user/" + username,
    function (error, response, body) {
      try {
        var json = JSON.parse(body);
      } catch (err) {}
      if (!json) return res.send({ success: false });
      if (!json.uuid) return res.send({ success: false });
      uuid = json.uuid;
      var userPath = "users/" + uuid + ".json";
      if (!fs.existsSync(userPath)) return res.send({ success: false });
      fs.readFile(userPath, function (err, data) {
        var json = JSON.parse(data);
        delete json.cosmetics[wings];
        let newwings = JSON.stringify(json, null, 2);
        fs.writeFileSync(userPath, newwings);
      });
      res.send({ success: true });
    }
  );
});
// ADMIN PANEL DISPLAY & FUNCTIONS END

app.get("*", function (req, res) {
  // simple 404
  res
    .status(404)
    .send(
      `<h1>404</h1>Please read the <a href="https://github.com/ItsVops/CB-Cosmetics-API/wiki"><b>CB Cosmetics API</b></a> wiki to see where you are suppose to go.`
    );
});

app.listen(config.port, function () {
  // OPEN THE GATES (turn on api)
  request("https://httpbin.org/ip", function (error, response, body) {
    //this shows the hosts ip for the console to display (makes it eaiser for the host)
    if (error) return console.log(`CB Cosmetics API is online!`);
    var json = JSON.parse(body);
    var origin = json.origin;
    if (!origin) return console.log(`CB Cosmetics API is online!`);
    if (config.dev) {
      origin = "127.0.0.1";
    }
    if (!config.secret) {
      console.log(
        "Something is wrong with the config.json! Please fix it or redownload."
      );
      exit();
    }
    if (config.secret == "ENTER_SECRET_HERE") {
      console.log("Please change the Panel Secret in config.json!");
      exit();
    }
    if (!config.port) {
      console.log(
        "Something is wrong with the config.json! Please fix it or redownload."
      );
      exit();
    }
    console.log(
      `CB Cosmetics API is online!\nPublic Link: http://${origin}:${config.port}\nPanel Link: http://${origin}:${config.port}/${config.secret}/panel\nNote: Port ${config.port} must be open for this API to be accessible by the public.`
    );
  });
});
