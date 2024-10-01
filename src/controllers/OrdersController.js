const {
  Orders,
  Pizza,
  Toppings,
  Users,
  OrderToppings,
} = require("../../models");
const {
  createOrderSchema,
  updateOrderSchema,
} = require("../validations/orderValidation");

// Create an order
exports.createOrder = async (req, res) => {
  // if (!req.ability.can("create", "Order")) {
  //   return res.status(403).json({ msg: "Permission denied to edit toppings" });
  // }
  const result = createOrderSchema.safeParse(req.body);
  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { pizaId, toppingIds, amount } = result.data;

  try {
    // Find pizza by ID
    const pizza = await Pizza.findByPk(pizaId);

    if (!pizza) {
      return res.status(404).json({ msg: "Pizza not found" });
    }

    // Verify that each topping belongs to the pizza
    const validToppings = await Toppings.findAll({
      where: {
        id: toppingIds,
        "$Pizzas.id$": pizaId,
      },
      include: Pizza,
    });

    if (validToppings.length !== toppingIds.length) {
      return res.status(400).json({
        msg: "One or more toppings do not belong to the selected pizza",
      });
    }

    // Create order
    const order = await Orders.create({
      pizaId: pizaId,
      userId: req.user.id,
      amount,
      restaurantsId: pizza.restaurantsId,
      status: "Pending", // Default order status
    });

    toppingIds.forEach(async (id) => {
      console.log(id);
      await OrderToppings.create({
        orderId: order.id,
        toppingId: id,
      });
    });

    res.status(201).json({ msg: "Order created successfully", order });
  } catch (error) {
    res.status(500).json({ msg: "Error creating order", error });
  }
};

exports.getAllOrdersByRestaurant = async (req, res) => {
  if (!req.ability.can("read", "Orders")) {
    return res.status(403).json({ msg: "Permission denied to read orders" });
  }

  try {
    const orders = await Orders.findAll({
      where: {
        restaurantsId: req.user.restaurantsId, // Filter by restaurantsId
      },
      include: [
        {
          model: Pizza,
        },
        {
          model: Users,
        },
        {
          model: Toppings, // You can directly include Toppings since it's a many-to-many relationship
          through: {
            attributes: [], // Exclude OrderToppings attributes if needed
          },
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ msg: "Error fetching orders", error: error.message });
  }
};
// Get order by ID
exports.getOrderById = async (req, res) => {
  if (!req.ability.can("read", "Orders")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to read orders sdfss" });
  }
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id, {
      include: [
        {
          model: Pizza,
          include: { model: Toppings, through: { attributes: [] } },
        },
        // {
        //   model: Toppings,
        //   through: { attributes: [] }, // Exclude join table attributes
        // },
      ],
    });

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching order", error });
  }
};

// Update order status
exports.updateOrder = async (req, res) => {
  if (!req.ability.can("edite", "Orders")) {
    return res
      .status(403)
      .json({ msg: "Permission denied to update order status" });
  }
  const { id } = req.params;
  const result = updateOrderSchema.safeParse(req.body);

  if (!result.success) {
    const errors = result.error.errors.map(
      (err) => `${err.path[0]}: ${err.message}`
    );
    return res.status(400).json({ errors });
  }

  const { status } = result.data;

  try {
    // Find order by ID
    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }
    if (!(order.restaurantsId == req.user.restaurantsId)) {
      return res
        .status(403)
        .json({ msg: "Permission denied to update order status" });
    }

    // Update the status
    order.status = status;
    await order.save();

    res.status(200).json({ msg: "Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ msg: "Error updating order", error });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  if (!req.ability.can("delete", "Orders")) {
    return res.status(403).json({ msg: "Permission denied to delete orders" });
  }
  const { id } = req.params;

  try {
    const order = await Orders.findByPk(id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    await order.destroy();

    res.status(200).json({ msg: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting order", error });
  }
};

// Get all orders by userId
exports.getOrdersByUserId = async (req, res) => {
  try {
    const orders = await Orders.findAll({
      where: {
        userId: req.user.id, // Filter orders by userId
      },
      include: [
        {
          model: Pizza,
        },

        {
          model: Toppings, // You can directly include Toppings since it's a many-to-many relationship
          through: {
            attributes: [], // Exclude OrderToppings attributes if needed
          },
        },
      ],
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching orders", error });
  }
};
