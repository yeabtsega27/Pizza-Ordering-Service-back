const { sequelize } = require("../models"); // Ensure sequelize is properly imported
const bcrypt = require("bcrypt");
const { Users, Restaurants, Orders, Pizza, Roles } = require("../models");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const {
  createRestaurantSchema,
} = require("../validations/restaurantValidation");

// Get all restaurants or a specific restaurant by ID
exports.getRestaurant = async (req, res) => {
  const { id } = req.params;

  try {
    // Get a single restaurant by ID
    const restaurant = await Restaurants.findByPk(id, {});
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant not found" });
    }
    return res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching restaurant(s)", error });
  }
};

// Get all restaurants or a specific restaurant by ID

exports.getAllRestaurant = async (req, res) => {
  try {
    // Get all restaurants with order count
    const restaurants = await Restaurants.findAll({
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("Orders.id")), "orderCount"],
        ],
      },
      include: [
        {
          model: Orders,
          attributes: [], // Exclude order details, just count them
        },
      ],
      group: ["Restaurants.id"], // Group by restaurant ID to count orders per restaurant
    });

    return res.status(200).json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error); // Log the full error for debugging
    return res.status(500).json({ msg: "Error fetching restaurant(s)", error });
  }
};

// Update restaurant details
exports.updateRestaurant = async (req, res) => {
  if (!req.ability.can("edite", "Restaurant")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edite Restaurant" });
  }
  const { id } = req.params;
  const { name, location } = req.body;

  try {
    // Find restaurant by ID
    let restaurant = await Restaurants.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant not found" });
    }
    if (!restaurant.id == req.user.restaurantsId) {
      return res
        .status(403)
        .json({ msg: "Permission denied to edite Restaurant" });
    }

    // Check if there's a new logo image to upload
    if (req.files && req.files.logo) {
      const logo = req.files.logo;

      const logoName = uuidv4() + logo.name;
      const uploadPath = path.join(__dirname, "../uploads/", logoName);

      // Delete old logo file
      if (restaurant.logo) {
        const oldLogoPath = path.join(
          __dirname,
          "../uploads/",
          restaurant.logo
        );
        if (fs.existsSync(oldLogoPath)) {
          fs.unlinkSync(oldLogoPath); // delete old logo
        }
      }

      // Upload new logo
      logo.mv(uploadPath, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error uploading new logo");
        }
      });

      restaurant.logo = logoName;
    }

    // Update restaurant details
    restaurant.name = name || restaurant.name;
    restaurant.location = location || restaurant.location;

    await restaurant.save();

    res
      .status(200)
      .json({ msg: "Restaurant updated successfully", restaurant });
  } catch (error) {
    res.status(500).json({ msg: "Error updating restaurant", error });
  }
};

// Delete restaurant and associated data (orders, pizza, roles)
exports.deleteRestaurant = async (req, res) => {
  if (!req.ability.can("delete", "Restaurant")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to delete Restaurant" });
  }
  const { id } = req.params;

  try {
    // Find restaurant by ID
    const restaurant = await Restaurants.findByPk(id);

    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant not found" });
    }
    if (!(restaurant.id == req.user.restaurantsId)) {
      return res
        .status(403)
        .json({ msg: "Permission denied to delete Restaurant" });
    }

    // Delete restaurant (with cascade deletion of related orders, pizza, and roles)
    await restaurant.destroy();

    res
      .status(200)
      .json({ msg: "Restaurant and related data deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting restaurant", error });
  }
};

// Create a new restaurant and assign the user as super admin
exports.createRestaurant = async (req, res) => {
  // Validate the request body with Zod
  const result = createRestaurantSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => err.path[0] + " " + err.message
    );
    console.log(result);

    return res.status(400).json({ errors });
  }

  const { name, email, password, location, phone_no, restaurant_name } =
    req.body;

  // Check if the logo image is uploaded

  if (!req.files || !req.files.logo) {
    return res.status(400).json({ msg: "Logo image is required" });
  }

  const logo = req.files.logo;
  const logoName = uuidv4() + logo.name;
  const uploadPath = path.join(__dirname, "../uploads/", logoName);

  try {
    // Check if the user already exists
    let user = await Users.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Upload the logo image
    logo.mv(uploadPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error while uploading logo image");
      }
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    user = await Users.create({
      name,
      email,
      password: hashedPassword,
      location,
      phone_no,
      role: "restaurant_manager",
    });

    // Create the restaurant
    const restaurant = await Restaurants.create({
      name: restaurant_name,
      location,
      logo: logoName.toString(), // Store the logo path
      super_admin: user.id, // Assign the user as the super admin
    });

    await user.update({ restaurantsId: restaurant.id });

    return res.status(201).json({
      msg: "Restaurant and user created successfully",
      user,
      restaurant,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};
