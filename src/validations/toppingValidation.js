const { z } = require("zod");

const createToppingSchema = z.object({
  name: z.string().min(1, "Topping name is required"),
});

const updateToppingSchema = z.object({
  name: z.string().min(1, "Topping name is required").optional(),
});

module.exports = {
  createToppingSchema,
  updateToppingSchema,
};
