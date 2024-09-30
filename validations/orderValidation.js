const { z } = require("zod");

const createOrderSchema = z.object({
  pizaId: z.string().min(1, "Pizza ID must be provided"),
  toppingIds: z.array(z.number()).min(1, "Topping IDs must be provided"),
  amount: z.number().min(1, "Amount must be at least 1"),
});

const updateOrderSchema = z.object({
  status: z.enum(["Pending", "Preparing", "Ready", "Delivered"]),
});

module.exports = {
  createOrderSchema,
  updateOrderSchema,
};
