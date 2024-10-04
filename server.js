const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const { sequelize } = require("./models"); // Assuming your Sequelize instance is defined in a models/index.js file
const fileUpload = require("express-fileupload");
const PORT = process.env.PORT || 4000;

const path = require("path");

//import routes
const RestaurantsRouter = require("./src/routers/restaurantsRouter");
const PermissionRouter = require("./src/routers/PermissionRouter");
const RolesRouter = require("./src/routers/rolesRouter");
const UsersRouter = require("./src/routers/UsersRouter");
const PizzaRouter = require("./src/routers/PizzaRouter");
const ToppingRouter = require("./src/routers/ToppingRouter");
const ordersRoutes = require("./src/routers/OrdersRouter");
const DashboardRouter = require("./src/routers/DashboardRouter");

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

app.use("/api/v1/image", express.static(path.join(__dirname, "./src/uploads")));

// Routes

app.use("/api/v1/restaurants", RestaurantsRouter);
app.use("/api/v1/per", PermissionRouter);
app.use("/api/v1/roles", RolesRouter);
app.use("/api/v1/users", UsersRouter);
app.use("/api/v1/pizza", PizzaRouter);
app.use("/api/v1/topping", ToppingRouter);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/dashboard", DashboardRouter);

// Sync Sequelize models with the database
sequelize
  .sync({ force: false }) // Set force to true to drop and recreate tables on each app start (be cautious in production)
  .then(async () => {
    console.log("Database synced"); // Import the User model

    // Check if the users table is empty

    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
