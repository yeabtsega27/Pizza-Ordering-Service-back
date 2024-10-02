const jwt = require("jsonwebtoken");
const { Users, Permission, Roles } = require("../../models");
const { AbilityBuilder, Ability } = require("@casl/ability"); // Import CASL Ability
require("dotenv").config();

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const defineAbilitiesFor = (user, role) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === "restaurant_manager") {
    if (!user.sub_role) {
      // Super admin abilities (can manage all, except create orders)
      can("manage", "all"); // Super admins can do everything
      cannot("create", "Order"); // But they can't create orders
    } else {
      // Restaurant Manager with sub-role
      role.Permissions.forEach((permission) => {
        can(permission.action.toLowerCase(), permission.object);
      });
      cannot("create", "Order"); // But they can't create orders
      // Restrict actions if needed, you can further define specific actions they cannot do here.
    }
  } else if (user.role === "customer") {
    // Customer abilities (create and read their own orders and profile)
    can("read", "Order", { customerId: user.id });
  }

  can("edite", "User", { id: user.id });
  can("read", "User", { id: user.id });

  return build(); // Build and return the abilities
};

const auth = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (authHeader) {
    // Extract the token from the "Bearer" scheme
    const token = authHeader.split(" ")[1];

    // Verify the token
    jwt.verify(token, JWT_SECRET, async (err, decodedUser) => {
      if (err) {
        return res.status(403).json({ msg: "Token is not valid" });
      }

      // Find the user by ID
      const user = await Users.findByPk(decodedUser.id);
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (user.role === "restaurant_manager") {
        if (!user.sub_role) {
          console.log("Super admin");
          const ability = defineAbilitiesFor(user);
          req.ability = ability; // Store abilities in request
        } else {
          // Find the role and permissions for the restaurant manager
          const role = await Roles.findByPk(user.sub_role, {
            include: [
              {
                model: Permission,
                through: { attributes: [] }, // Exclude join table attributes
              },
            ],
          });

          if (!role) {
            return res.status(404).json({ msg: "Role not found" });
          }

          console.log("Role permissions:", role.Permissions);
          // Define abilities based on permissions
          const ability = defineAbilitiesFor(user, role);
          req.ability = ability; // Store abilities in request
        }
      } else if (user.role === "customer") {
        console.log("Customer");
        // Define abilities for customers
        const ability = defineAbilitiesFor(user);
        req.ability = ability; // Store abilities in request
      }
      req.user = user;

      // Call the next middleware or route handler

      next();
    });
  } else {
    // No token provided
    return res.status(401).json({ msg: "Authorization token missing" });
  }
};

module.exports = auth;
