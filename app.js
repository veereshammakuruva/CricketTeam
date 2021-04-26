const express = require("express");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const path = require("path");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;

//Initializing Database and server
const initializDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error:${e.message}`);
    process.exit(1);
  }
};

initializDBAndServer();

//Get players

app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT *FROM cricket_team`;
  const players = await db.all(getPlayersQuery);

  response.send(players);
});

// Add player
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const addPlayerQuery = `
        INSERT INTO cricket_team(player_name, jersey_Number, role)
        VALUES ('${playerName}', ${jerseyNumber}, '${role}')
        `;
  await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

//GET PLayer
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `SELECT *FROM cricket_team WHERE player_id = ${playerId}`;
  const playerDetails = await db.get(getPlayerQuery);
  response.send(playerDetails);
});

//UPDATE player details
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const { playerName, jerseyNumber, role } = request.body;
  const updatePlayerDetailsQuery = `
              UPDATE cricket_team SET
              player_name = '${playerName}',
              jersey_number = ${jerseyNumber},
              role = '${role}'
              WHERE player_id = ${playerId}
          `;
  await db.run(updatePlayerDetailsQuery);
  response.send("Player Details Updated");
});

//DELETE player
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId}
  `;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});

module.exports = app;
