// src/server.js
const { Server } = require("boardgame.io/server");
const { Scuttle } = require("../Game");

const server = Server({ games: [Scuttle] });

server.run(8000, () => console.log("server running..."));
