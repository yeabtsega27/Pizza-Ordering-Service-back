// create user controller for register login getme Updateme getusers getuser updateuser destroyuser SECRET_KEY from .env
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

const register = async (req, res) => {
  try {
    // Get user input
    const { name, email, password } = req.body;
    // Validate user input
    if (!(email && password && name)) {
      return res.status(400).json({ error: "All input is required" });
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) {
      return res
        .status(409)
        .json({ error: "User Already Exist. Please Login" });
    }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      role: "user",
    });
    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY
    );

    const userWithoutPassword = { ...user.get(), password: undefined };
    // return new user
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const login = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).json({ error: "All input is required" });
    }
    // Validate if user exist in our database
    const user = await User.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.SECRET_KEY
      );
      const userWithoutPassword = { ...user.get(), password: undefined };
      // return new user
      res.status(200).json({ user: userWithoutPassword, token });
    } else {
      res.status(400).json({ error: "Invalid Credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const userWithoutPassword = { ...user.get(), password: undefined };
    // return new user
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// update me if if new password is not empty then encrypt it and update it if not then update name and email
const updateMe = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email)) {
      return res.status(400).json({ error: "All input is required" });
    }
    const user = await User.findByPk(req.user.id);
    if (password) {
      encryptedPassword = await bcrypt.hash(password, 10);
      user.password = encryptedPassword;
    }
    user.name = name;
    user.email = email;
    await user.save();
    const userWithoutPassword = { ...user.get(), password: undefined };
    // return new user
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};
// create User
const createUser = async (req, res) => {
  try {
    // Get user input
    const { name, email, password, role } = req.body;
    // Validate user input
    if (!(email && password && name)) {
      return res.status(400).json({ error: "All input is required" });
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ where: { email } });
    if (oldUser) {
      return res
        .status(409)
        .json({ error: "User Already Exist. Please Login" });
    }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
      role,
    });
    // Create token

    const userWithoutPassword = { ...user.get(), password: undefined };
    // return new user
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// get user by id
const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const userWithoutPassword = { ...user.get(), password: undefined };
    // return new user
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// update user by id
const updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!(name && email)) {
      return res.status(400).json({ error: "All input is required" });
    }
    const user = await User.findByPk(req.params.id);
    if (password) {
      encryptedPassword = await bcrypt.hash(password, 10);
      user.password = encryptedPassword;
    }
    user.name = name;
    user.email = email;
    user.role = role;
    await user.save();

    const userWithoutPassword = { ...user.get(), password: undefined };
    // return new user
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

// delete user by id
const destroyUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.id === req.user.id) {
      return res.status(403).json({ error: "You cannot delete yourself" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateMe,
  createUser,
  getUsers,
  getUser,
  updateUser,
  destroyUser,
};
