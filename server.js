const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

const users = {};

app.use(express.static(path.join(__dirname)));

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-connected", name);
  });

  socket.on("send-chat-msg", (m) => {
    var r = jsCrypto.crypto(m, "FcFLwoKAbZ");
    socket.broadcast.emit("chat-message", {
      message: jsCrypto.crypto(r, "INHiFpg22k"),
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    delete users[socket.id];
  });
});

var jsCrypto = {
  crypto: function (s, k) {
    var enc = "";
    var str = s.toString();
    for (var i = 0; i < s.length; i++) {
      var a = s.charCodeAt(i);
      var b = a ^ k;
      enc = enc + String.fromCharCode(b);
    }
    return enc;
  },
};

const PORT = 3000;
http.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
