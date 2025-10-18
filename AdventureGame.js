// ===========================================
// The Dragon's Quest - Text Adventure Game
// A progression-based learning project
// ===========================================

// Include readline for player input
const readline = require("readline-sync");

// Game state variables
let gameRunning = true;
let playerName = "";
let playerHealth = 100;
let playerGold = 20; // Starting gold
let currentLocation = "village";

// Item templates with properties
const healthPotion = {
  name: "Health Potion",
  type: "potion",
  value: 5, // Cost in gold
  effect: 30, // Healing amount
  description: "Restores 30 health.",
};

const sword = {
  name: "Sword",
  type: "weapon",
  value: 10, // Cost in gold
  effect: 10, // Damage amount
  description: "A sturdy blade for combat.",
};

const steelSword = {
  name: "Steel Sword",
  type: "weapon",
  value: 22, //gold cost
  effect: 18, //protection amount
  description: "A sharp, well balanced steel blade for combat."
};

const woodenArmor = {
  name: "Wooden Shield",
  type: "armor",
  value: 8, //gold cost
  effect: 5, //protection amount
  description: "Reduces damage taken in combat"
};

const ironArmor = {
  name: "Iron Shield",
  type: "armor",
  value: 15, //gold cost
  effect: 12, //protection amount
  description: "Offers solid defense and greater durability in battle."
};

// Create empty inventory array (from previous lab)
let inventory = []; // Will now store item objects instead of strings

// ===========================
// Display Functions
// Functions that show game information to the player
// ===========================

/**
 * Shows the player's current stats
 * Displays health, gold, and current location
 */
function showStatus() {
  console.log("\n=== " + playerName + "'s Status ===");
  console.log("Health: " + playerHealth);
  console.log("Gold: " + playerGold);
  console.log("Location: " + currentLocation);

  console.log("Inventory: ");
  if (inventory.length === 0) {
    console.log("   Nothing in inventory ");
  } else {
    inventory.forEach((item, index) => {
      console.log(
        "   " + (index + 1) + ". " + item.name + " - " + item.description
      );
    });
  }
}

/**
 * Shows the current location's description and available choices
 */
function showLocation() {
  console.log("\n=== " + currentLocation.toUpperCase() + " === ");

  if (currentLocation === "village") {
    console.log("You're in a bustling village. The blacksmith and market are nearby.");

    console.log("\nWhat would you like to do?");
    console.log("1: Go to blacksmith");
    console.log("2: Go to market");
    console.log("3: Enter forest");
    console.log("4: Go to mountains");
    console.log("5: Check status");
    console.log("6: Use item");
    console.log("7: Help");
    console.log("8: Quit game");
  } 
  else if (currentLocation === "blacksmith") {
    console.log("The forge burns bright. Weapons and armor hang on the walls.");

    console.log("\n1: Buy Sword (10 gold)");
    console.log("2: Buy Steel Sword (22 gold)");
    console.log("3: Buy Wooden Shield (8 gold)");
    console.log("4: Buy Iron Shield (15 gold)");
    console.log("5: Return to village");
    console.log("6: Check status");
    console.log("7: Quit game");
  }else if (currentLocation === "market") {
    console.log("Merchants call out their prices. The potion seller waves at you .");

    console.log("\n1: Buy Health Potion (5 gold)");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Quit game");
  } else if (currentLocation === "forest") {
    console.log("The forest is alive with danger....");

    console.log("\n1: Fight a monster");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Quit game");
  }else if (currentLocation === "mountains") {
    console.log("You climb to the dragon's mountain lair..... The air smells of fire, ashes and smoke!");

    console.log("\n1: Fight the Dragon");
    console.log("2: Return to village");
    console.log("3: Check status");
    console.log("4: Quit game");
  }
}

// ===========================
// Combat Functions
// Functions that handle battles and health
// ===========================

/**
 * Handles monster battles
 * Checks if player has weapon and manages combat results
 * @returns {boolean} true if player wins, false if they retreat
 */
function handleCombat(isDragon = false) {
  console.log(isDragon ? "\n A fearsome, big DRAGON appears!" : "\nA wild, scary monster attacks!");
  let monster;
  if(isDragon) {
    monster = {health:50, damage: 20 };
  } else {
    monster = {health: 20, damage: 10};
  }
  const weapon = getBestItem("weapon");
  const armor = getBestItem("armor");


  if (!weapon) {
    console.log("You have no weapon! You can't fight and must retreat and run!");
    updateHealth(-20);
    return false;
  }
  console.log(`You ready your ${weapon.name} (${weapon.effect} attack) .`);
  if (armor) {
    console.log(`You equip your ${armor.name} (${armor.effect} protection).`);
  } else {
    console.log("You have no armor equipped!");
  }
  // Combat loop to see monsters health
  while (monster.health > 0 && playerHealth > 0) {
    console.log("\nYou strike the enemy!");
    monster.health -= weapon.effect;
    if (monster.health < 0) monster.health = 0;
    console.log(`You dealt ${weapon.effect} damage. Monster health: ${monster.health}`);

    if (monster.health <= 0) break;

    console.log(" The enemy attacks!");
    let DamageDone = monster.damage;

    if (armor) {
      DamageDone -= armor.effect;
      if ( DamageDone < 1) DamageDone = 1; 
      console.log(`Your armor absorbs ${armor.effect} damage!`);
    }

    console.log(`You take ${DamageDone} damage.`);
    updateHealth(-DamageDone);
  }
  if (playerHealth <= 0) {
    console.log("\nYou were defeated in battle!");
    return false;
  }
  if (isDragon) {
    console.log("\nYou have slain the big dragon!");
    console.log("You earn 100 gold and eternal glory!");
    playerGold += 100;
    console.log("Congratulations, you won the game!");
    gameRunning = false;
  }else {
    console.log("\nYou defeated the monster!");
    console.log("You earn 10 gold !");
    playerGold += 10;
  }
  return true;
}

/**
 * Updates player health, keeping it between 0 and 100
 * @param {number} amount Amount to change health by (positive for healing, negative for damage)
 * @returns {number} The new health value
 */
function updateHealth(amount) {
  playerHealth += amount;

  if (playerHealth > 100) {
    playerHealth = 100;
    console.log("You're at full health!");
  }
  if (playerHealth < 0) {
    playerHealth = 0;
    console.log("You're gravely wounded!");
  }

  console.log("Health is now: " + playerHealth);
  return playerHealth;
}

// ===========================
// Item Functions
// Functions that handle item usage and inventory
// ===========================

function getBestItem(type) {
  const items = inventory.filter(item => item.type === type );
  if (items.length === 0) return null;

  //updates to bestItem
  let bestItem = items[0];
  for (let item of items) {
    if (item.effect > bestItem.effect) {
      bestItem = item;
    }
  }
  return bestItem;
}

function hasGoodEquipment() {
  const bestWeapon = getBestItem("weapon");
  const bestArmor = getBestItem("armor");

  if (bestWeapon && bestWeapon.effect >= 15 && bestArmor && bestArmor.effect >= 10) {
    console.log("You have a strong weapon, armor and you are ready to face the dragon! So fight!");
    return true;
  } else {
    console.log("You need a stronger weapon before facing the dragon! So run!!!");
    return false;
  }
}

/**
 * Handles using items like potions
 * @returns {boolean} true if item was used successfully, false if not
 */
function useItem(){
  if (inventory.length === 0) {
    console.log("\nYou have no items!");
    return false;
  }

  console.log("\n=== Inventory ===");
  inventory.forEach((item, i) => console.log(`${i + 1}: ${item.name}`));
  const choice = readline.question("Which item you want to use? (number or 'cancel'): ");
  if (choice === "cancel" ) return false;
  const index = parseInt(choice) - 1;
  const item = inventory[index];
  if (!item){
    console.log("Invalid choice!");
    return false;
  }
  if (item.type === "potion"){
    console.log(`You use a ${item.name}.`);
    updateHealth(item.effect);
    inventory.splice(index, 1);
    return true;
  } 
  else {
    console.log("You can't use that now! ");
    return false;
  }
}

/**
 * Displays the player's inventory
 */
function checkInventory() {
  console.log("\n==== INVENTORY ====");
  if (inventory.length === 0) {
    console.log("Your inventory is empty!");
    return;
  }

  // Display all inventory items with numbers and descriptions
  inventory.forEach((item, index) => {
    console.log(index + 1 + ". " + item.name + " - " + item.description);
  });
}

// ===========================
// Shopping Functions
// Functions that handle buying items
// ===========================

/**
 * Handles purchasing items at the blacksmith
 */
function buyItem(item) {
  if (playerGold >= item.value) {
    inventory.push({ ...item });
    playerGold -= item.value;
    console.log(`You bought ${item.name} for ${item.value} gold.`);
  }else {
    console.log("You don't have enough gold!");
  }
}

function buyFromBlacksmith(choice) {
  if (choice === 1)  {
    buyItem(sword);
  }else if (choice === 2) {
    buyItem(steelSword);
  } 
  else if (choice === 3){
    buyItem(woodenArmor);
  } 
  else if (choice === 4) {
    buyItem(ironArmor);
  }else if (choice === 5) {
  currentLocation = "village";
  }
}



function buyFromMarket (choice) {
  if (choice === 1) {
     buyItem(healthPotion);
  }else if (choice === 2) {
    currentLocation = "village";
  }
}

// ===========================
// Help System
// Provides information about available commands
// ===========================

/**
 * Shows all available game commands and how to use them
 */
function showHelp() {
  console.log("\n=== AVAILABLE COMMANDS ===");

  console.log("\nMovement Commands:");
  console.log("- In the village, choose 1-3 to travel to different locations");
  console.log(
    "- In other locations, choose the return option to go back to the village"
  );

  console.log("\nBattle Information:");
  console.log("- You need a weapon to win battles");
  console.log("- Weapons have different damage values");
  console.log("- Monsters appear in the forest");
  console.log("- Without a weapon, you'll lose health when retreating");

  console.log("\nItem Usage:");
  console.log("- Health potions restore health based on their effect value");
  console.log(
    "- You can buy potions at the market for " + healthPotion.value + " gold"
  );
  console.log(
    "- You can buy a sword at the blacksmith for " + sword.value + " gold"
  );

  console.log("\nOther Commands:");
  console.log("- Choose the status option to see your health and gold");
  console.log("- Choose the help option to see this message again");
  console.log("- Choose the quit option to end the game");

  console.log("\nTips:");
  console.log("- Keep healing potions for dangerous areas");
  console.log("- Defeat monsters to earn gold");
  console.log("- Health can't go above 100");
}

// ===========================
// Movement Functions
// Functions that handle player movement
// ===========================

/**
 * Handles movement between locations
 * @param {number} choiceNum The chosen option number
 * @returns {boolean} True if movement was successful
 */
function move(choiceNum) {
  let validMove = false;

  if (currentLocation === "village") {
    if (choiceNum === 1) {
      currentLocation ="blacksmith";
      console.log("\nYou enter the blacksmith's shop.");
      validMove = true;
    }else if (choiceNum === 2) {
      currentLocation = "market";
      console.log("\nYou walk to the market.");
      validMove = true;
    } else if (choiceNum ===3) {
      currentLocation = "forest";
      console.log("\nYou venture into the forest.....");
      validMove = true;
    } else if (choiceNum === 4) {
      if (hasGoodEquipment()) {
        currentLocation="mountains";
        console.log("\nYou travel toward the dragon's mountain lair....");
        validMove = true;
      } else {
        console.log("\nYou are not ready to face the dragon! Better gear up first. Buy new items in market or blacksmith's shop ");
        validMove = false; 
      }
    }
  }
  else if (currentLocation === "blacksmith") {
    if (choiceNum === 5) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  }else if (currentLocation === "market"){
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou return to the village center.");
      validMove = true;
    }
  }
  else if (currentLocation === "forest") {
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou hurry back to the safety of the village.");
      validMove = true;
    }
  }else if (currentLocation === "mountains"){
    if (choiceNum === 2) {
      currentLocation = "village";
      console.log("\nYou descend the mountain and return to the village.");
      validMove = true;
    }
  }
  return validMove;
}

// ===========================
// Combat Action Functions
// Functions that handle combat choices
// ===========================
function fightMonster() {
  handleCombat(false);
}
function seeDragon() {
  handleCombat(true);
}


//============================
//Add input validation helper function
//=============================
function isValidChoice(choice, min, max) {
  return !isNaN(choice) && choice >= min && choice <= max;
}
// ===========================
// Main Game Loop
// Controls the flow of the game
// ===========================
function startGame() {
  console.log("=================================");
  console.log("       The Dragon's Quest        ");
  console.log("=================================");
  console.log("\nYour quest: Defeat the dragon in the mountains!");

  // Get player's name
  playerName = readline.question("\nWhat is your name, brave adventurer? ");
  console.log("\nWelcome, " + playerName + "!");
  console.log("You start with " + playerGold + " gold.");

  while (gameRunning) {
    // Show current location and choices
    showLocation();

    // Get and validate player choice
    let validChoice = false;
    while (!validChoice) {
      try {
        let choice = readline.question("\nEnter your choice (number): ");

        // Check for empty input
        if (choice.trim() === "") throw "Please enter a number!";

        let choiceNum = parseInt(choice);
        if (isNaN(choiceNum)) throw "That's not a number! Please enter a number.";

        if (currentLocation === "village") {
          if (!isValidChoice(choiceNum, 1, 8)) throw " Please enter a number between 1 and 8.";
          validChoice = true;
          if (choiceNum === 1) {
            move(1);
          } else if (choiceNum === 2) {
            move(2);
          } 
          else if (choiceNum === 3) {
            move(3);
          } else if (choiceNum === 4) {
            move(4);
          } 
          else if (choiceNum === 5) {
            showStatus();
          } 
          else if (choiceNum === 6) {
            useItem();
          } else if (choiceNum === 7 ) {
            showHelp ();
          }else if (choiceNum === 8) {
            gameRunning = false;
            console.log("\nThanks for playing this game!");
          }
        } else if (currentLocation === "blacksmith") {
          if (!isValidChoice(choiceNum, 1, 7)) throw "Please enter a number between 1 and 7!";
          validChoice = true;
          if (choiceNum === 1) {
            buyFromBlacksmith(1);
          }else if (choiceNum === 2) {
            buyFromBlacksmith(2);
          }else if (choiceNum === 3) {
            buyFromBlacksmith(3);
          }else if (choiceNum === 4) {
             buyFromBlacksmith(4);
          }else if (choiceNum === 5) {
            move(5);
          } 
          else if (choiceNum === 6) {
            showStatus();
          } 
          else if (choiceNum === 7) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        }else if (currentLocation === "market") {
          if (!isValidChoice(choiceNum, 1, 4)) throw "Please enter a number between 1 and 4!";
          validChoice = true;

          if (choiceNum === 1) {
            buyFromMarket(1);
          }else if (choiceNum === 2) {
            move(2);
          }else if (choiceNum === 3){
            showStatus();
          } 
          else if (choiceNum === 4) {
            gameRunning = false;
            console.log("\nThanks for playing!");
          }
        } else if (currentLocation === "forest") {
          if (!isValidChoice(choiceNum, 1, 4))throw "Please enter a number between 1 and 4!";
          validChoice = true;
          if (choiceNum === 1) {
            fightMonster();
          }else if (choiceNum === 2){
            move(2);
          } 
          else if (choiceNum ===3) {
            showStatus();
          }else if ( choiceNum === 4) {
            gameRunning = false;
            console.log("\nThanks for playing this game!");
          }
        } else if (currentLocation === "mountains") {
          if (!isValidChoice(choiceNum, 1, 4)) throw "Please enter a number between 1 and 4 !";
          validChoice = true;
          if (choiceNum === 1) {
            seeDragon();
          }else if (choiceNum === 2) {
            move(2);
          }else if (choiceNum === 3) {
            showStatus();
          }else if (choiceNum === 4) {
            gameRunning = false;
            console.log("\nThanks for playing this game!");
          }
        }
      } catch (error) {
        console.log("\nError: " + error);
        console.log("Please try again!");
      }
    }
    //Check if player died
    if (playerHealth <= 0) {
      console.log("\nGame Over! Your health reached 0! You dead.");
      gameRunning = false;
    }
  }
}

if (require.main === module) {
  startGame();
}

//===========
//For testing
//===========
module.exports = {
  //variables
  playerName,
  playerHealth,
  playerGold,
  inventory,
  currentLocation,
  gameRunning,


  //functions
  startGame, 
  showStatus,
  showLocation,
  handleCombat,
  updateHealth,
  useItem,
  checkInventory,
  getBestItem,
  hasGoodEquipment,
  buyFromBlacksmith,
  buyFromMarket,
  buyItem,
  showHelp,
  move,
  isValidChoice,
  fightMonster,
  seeDragon
};
