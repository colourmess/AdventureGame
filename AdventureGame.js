const readline = require("readline-sync");

console.log("Welcome to the Adventure Game");
console.log("Prepare yourself for an epic journey!");

let playerName = readline.question("Enter the player name: ");
console.log(`Player ${playerName}, congratulations on starting the game.`);

let health = 100;
let playerGold = 20;
console.log(`You have ${playerGold} gold.`);

let currentLocation = "village";
let gameRunning = true;
let inventory = [];
