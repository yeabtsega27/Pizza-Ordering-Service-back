const { z } = require("zod");

const createPizzaSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    price: z.string().min(0, "Price must be a positive number"),
    addedToppings: z
      .array(
        z.object({
          selected: z.boolean(),
          value: z.string(),
        })
      )
      .optional(),
    selectedToppings: z
      .array(z.string())
      .min(1, { msg: "At list one permissin is required" })
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.selectedToppings.length == 0 && data.addedToppings.length == 0) {
      ctx.addIssue({
        path: ["selectedToppings"], // Specify where to attach the error message
        message: "you nedd to enter selectedToppings or add nw topings",
        code: z.ZodIssueCode.custom,
      });
    }
  });

const editPizzaSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  price: z.string().min(0, "Price must be a positive number").optional(),
  newAddedToppings: z
    .array(
      z.object({
        selected: z.boolean(),
        value: z.string(),
      })
    )
    .optional(),
  addedToppings: z.array(z.string()).optional(),
  removedToppings: z.array(z.number()).optional(),
});

const addRemoveToppingSchema = z.object({
  pizzaId: z.string().min(1, "Pizza ID must be a positive number"),
  toppingId: z.string().min(1, "Topping ID must be a positive number"),
});

module.exports = {
  createPizzaSchema,
  editPizzaSchema,
  addRemoveToppingSchema,
};
