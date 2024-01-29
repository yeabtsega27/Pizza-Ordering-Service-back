// create user router
const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const {
  authenticate,
  authenticateAdmin,
} = require("../middleware/authenticate");

router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/me", authenticate, UserController.getMe);
router.put("/update", authenticate, UserController.updateMe);
router.post("/", authenticateAdmin, UserController.createUser);
router.get("/", authenticateAdmin, UserController.getUsers);
router.get("/:id", authenticateAdmin, UserController.getUser);
router.put("/:id", authenticateAdmin, UserController.updateUser);
router.delete("/:id", authenticateAdmin, UserController.destroyUser);

module.exports = router;
