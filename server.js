const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models"); // Assuming your Sequelize instance is defined in a models/index.js file
const fileUpload = require("express-fileupload");

//import routes
const userRouter = require("./routers/UserRouter");
const genreRouter = require("./routers/GenreRouter");
const movieRouter = require("./routers/MovieRouter");
const LikeRouter = require("./routers/LikeRouter");
const FavoriteRouter = require("./routers/FavoriteRouter");
const movelinkRouter = require("./routers/movelinkRouter");
const MovieGenreRouter = require("./routers/MovieGenreRouter");
const SeasonRouter = require("./routers/SeasonRouter");
const EpisodeRouter = require("./routers/EpisodeRouter");

// Middleware
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Expose-Headers", "Authorization"); // Expose the Authorization header
  next();
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "An error occurred" });
});

// Routes

app.use("/api/v1/users", userRouter);
app.use("/api/v1/geners", genreRouter);
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/likes", LikeRouter);
app.use("/api/v1/favorite", FavoriteRouter);
app.use("/api/v1/movelink", movelinkRouter);
app.use("/api/v1/moviegenre", MovieGenreRouter);
app.use("/api/v1/season", SeasonRouter);
app.use("/api/v1/episode", EpisodeRouter);

// Sync Sequelize models with the database
sequelize
  .sync({ force: false }) // Set force to true to drop and recreate tables on each app start (be cautious in production)
  .then(() => {
    console.log("Database synced");
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
