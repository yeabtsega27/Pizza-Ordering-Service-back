const fs = require("fs");

// List of model names
const MODELS = [
  "Movie",
  "Genre",
  "MovieGenre",
  "movelink",
  "User",
  "Like",
  "Favorite",
  "Season",
  "Episode",
];

// Create the "routers" folder
fs.mkdirSync("routers");

// Loop over the model names and create router files
MODELS.forEach((MODEL) => {
  const FILENAME = `${MODEL}Router.js`;
  fs.writeFileSync(`routers/${FILENAME}`, "");
});

// Create the "controllers" folder
fs.mkdirSync("controllers");

// Loop over the model names and create controller files
MODELS.forEach((MODEL) => {
  const FILENAME = `${MODEL}Controller.js`;
  fs.writeFileSync(`controllers/${FILENAME}`, "");
});

fs.mkdirSync("middleware");
// Create the "middleware" folder
fs.writeFileSync("middleware/authenticate.js", "");
