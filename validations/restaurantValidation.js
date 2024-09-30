const { z } = require("zod");

// Define the schema for user and restaurant input validation
const createRestaurantSchema = z.object({
  name: z.string().min(1, { msg: "Name is required" }),
  email: z.string().email({ msg: "Please include a valid email" }),
  password: z
    .string()
    .min(6, { msg: "Password must be at least 6 characters" }),
  phone_no: z
    .string()
    .min(10, { msg: "Phone number must be at least 10 digits" }),
  location: z.string().min(1, { msg: "Location is required" }),
  restaurant_name: z.string().min(1, { msg: "Restaurant name is required" }),
  logo: z.any(), // We will validate the logo file separately
});
module.exports = { createRestaurantSchema };
