// controllers/usersController.js
const { Users, Restaurants, Roles } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { where } = require("sequelize");
const { z } = require("zod");
require("dotenv").config();
const { Op } = require("sequelize"); // Import Sequelize operators

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Zod schema for validation
const userRegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  phone_no: z.string().min(10),
  password: z.string().min(6),
});

// Zod schema for restaurant manager registration validation
const restaurantManagerRegisterSchema = z.object({
  name: z.string().min(1, { msg: "Name is required." }),
  email: z.string().email({ msg: "Invalid email address." }),
  location: z.string().min(1, { msg: "Location is required." }),
  phone_no: z
    .string()
    .min(10, { msg: "Phone number must be at least 10 characters." }),
  password: z
    .string()
    .min(6, { msg: "Password must be at least 6 characters long." }),
  sub_role: z.number().int(), // Assuming sub_role is an integer
});

const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

exports.registerRestaurantManager = async (req, res) => {
  if (!req.ability.can("create", "restaurant_manager")) {
    return res.status(403).json({ msg: "Permission denied to add users" });
  }
  try {
    // Validate the input data
    const validatedData = restaurantManagerRegisterSchema.safeParse(req.body);
    if (!validatedData.success) {
      const errors = validatedData.error.errors.map(
        (err) => `${err.path[0]}: ${err.message}`
      );
      return res.status(400).json({ errors });
    }

    // Destructure validated data
    const { name, email, location, phone_no, password, sub_role } =
      validatedData.data;

    // Check if sub_role exists in the database
    const roleExists = await Roles.findByPk(sub_role);
    if (!roleExists) {
      return res.status(400).json({ msg: "Invalid sub_role ID." });
    }

    // Check if restaurantsId exists in the database
    const restaurantExists = await Restaurants.findByPk(req.user.restaurantsId);
    if (!restaurantExists) {
      return res.status(400).json({ msg: "Invalid restaurant ID." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Continue with the user creation logic...
    const newUser = await Users.create({
      name,
      email,
      location,
      phone_no,
      password: hashedPassword, // Hash the password before saving
      sub_role,
      restaurantsId: req.user.restaurantsId,
      role: "restaurant_manager",
    });

    res.status(201).json({
      msg: "Restaurant manager registered successfully",
      user: newUser,
    });
  } catch (error) {
    // Handle general errors
    res
      .status(500)
      .json({ msg: "Error registering restaurant manager", error });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const validatedData = userRegisterSchema.parse(req.body);

    const existingUser = await Users.findOne({
      where: { email: validatedData.email },
    });
    if (existingUser) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    // Create the user with hashed password
    const user = await Users.create({
      ...validatedData,
      password: hashedPassword, // Set the hashed password
    });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      msg: "User registered successfully",
      token,
      user: {
        id: user.id,
        role: user.role,
        sub_role: user.sub_role,
        restaurantsId: user.restaurantsId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ msg: "Registration failed", error: error.errors });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const validatedData = userLoginSchema.safeParse(req.body);
  if (!validatedData.success) {
    const errors = validatedData.error.errors.map(
      (err) => err.path[0] + " " + err.message
    );
    return res.status(400).json({ errors });
  }

  try {
    const user = await Users.findOne({
      where: { email: validatedData.data.email },
    });

    if (
      !user ||
      !bcrypt.compareSync(validatedData.data.password, user.password)
    ) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        sub_role: user.sub_role,
        restaurantsId: user.restaurantsId,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user.id,
        role: user.role,
        sub_role: user.sub_role,
        restaurantsId: user.restaurantsId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(400).json({ msg: "Login failed", error: error });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  if (!req.ability.can("read", "restaurant_manager")) {
    return res.status(403).json({ msg: "Permission denied to read users" });
  }
  try {
    const users = await Users.findAll({
      where: {
        restaurantsId: req.user.restaurantsId,
        sub_role: { [Op.ne]: null },
      },
    });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users", error });
  }
};

// Get a user by ID
exports.getRestaurantUserById = async (req, res) => {
  const { id } = req.params;
  if (!req.ability.can("read", "restaurant_manager", { id })) {
    return res.status(403).json({ msg: "Permission denied to read users" });
  }
  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!(user.restaurantsId == req.user.restaurantsId)) {
      return res
        .status(403)
        .json({ msg: "Permission denied to read this user" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user", error });
  }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  if (!req.ability.can("read", "user", { id })) {
    return res.status(403).json({ msg: "Permission denied to read users" });
  }
  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching user", error });
  }
};

// Update a user
exports.updateRestaurantUser = async (req, res) => {
  const { id } = req.params;
  if (!req.ability.can("edite", "restaurant_manager")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edite this user users" });
  }
  const updatedData = userRegisterSchema.safeParse(req.body); // Validate the updated data
  if (!updatedData.success) {
    const errors = updatedData.error.errors.map(
      (err) => err.path[0] + " " + err.message
    );
    return res.status(400).json({ errors });
  }
  try {
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (!(user.restaurantsId == req.user.restaurantsId)) {
      return res
        .status(404)
        .json({ msg: "Permission denied to edite this user users" });
    }
    const updateUser = await Users.update(updatedData.data, { where: { id } });

    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Update failed", error: error.errors });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  if (!req.ability.can("edite", "User", { id })) {
    return res
      .status(403)
      .json({ msg: "Permission denied to edite this user users" });
  }
  try {
    const updatedData = userRegisterSchema.parse(req.body); // Validate the updated data
    const user = await Users.update(updatedData, { where: { id } });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(200).json({ msg: "User updated successfully" });
  } catch (error) {
    res.status(400).json({ msg: "Update failed", error: error.errors });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  if (!req.ability.can("delete", "restaurant_manager")) {
    return res.status(403).json({ msg: "Permission denied to delete users" });
  }
  const { id } = req.params;
  try {
    // Fetch the user
    const user = await Users.findByPk(id);
    console.log("Ssdf");
    console.log(user);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (!(user.restaurantsId == req.user.restaurantsId)) {
      return res
        .status(404)
        .json({ msg: "Permission denied to delete this user users" });
    }
    // If user is a restaurant super admin, delete the restaurant and associated data
    if (user.role === "restaurant_manager" && !user.sub_role) {
      return res
        .status(404)
        .json({ msg: "Permission denied to delete this user users" });
    }

    // Finally, delete the user
    await user.destroy();
    res.status(200).json({
      msg: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting user", error });
  }
};
