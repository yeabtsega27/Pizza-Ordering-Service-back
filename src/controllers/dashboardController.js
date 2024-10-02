const { Orders, Users, Pizza, Sequelize } = require("../../models");
const { Op } = require("sequelize");

// Controller to get all dashboard metrics for a specific restaurant
exports.getDashboardMetrics = async (req, res) => {
  if (!req.ability.can("read", "Dashboard")) {
    return res.status(403).json({ msg: "Permission denied to read Dashboard" });
  }
  const restaurantsId = req.user.restaurantsId; // Ensure the restaurantId is passed as a query parameter
  console.log(restaurantsId);

  if (!restaurantsId) {
    return res.status(400).json({ error: "restaurantId is required" });
  }

  try {
    // Get Total Orders for the restaurant
    const totalOrders = await Orders.count({
      where: { restaurantsId },
    });

    // Get Total Revenue (sum of amount from Orders for the restaurant)
    const totalRevenue = await Orders.sum("amount", {
      where: { restaurantsId },
    });

    // Get the number of unique users who have ordered pizza from this restaurant
    const usersWhoOrdered = await Orders.count({
      where: { restaurantsId },
      distinct: true,
      col: "userId",
    });

    // Get the total number of active pizzas listed in the menu for the restaurant
    const activePizzas = await Pizza.count({
      where: { restaurantsId },
    });

    // Get the top 5 best-selling pizzas for the restaurant
    const topSellingPizzas = await Orders.findAll({
      attributes: [
        "pizaId",
        [Sequelize.fn("COUNT", Sequelize.col("pizaId")), "sales"],
      ],
      where: { restaurantsId },
      include: [
        {
          model: Pizza,
          attributes: ["name", "image"],
        },
      ],
      group: ["pizaId", "Pizza.id"],
      order: [[Sequelize.fn("COUNT", Sequelize.col("pizaId")), "DESC"]],
      limit: 5,
    });

    // Get the 5 most recent orders for the restaurant
    const recentOrders = await Orders.findAll({
      where: { restaurantsId },
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["name"],
        },
        {
          model: Pizza,
          attributes: ["name", "image"],
        },
      ],
    });

    // Combine all metrics into a single response
    return res.status(200).json({
      totalOrders,
      totalRevenue,
      usersWhoOrdered,
      activePizzas,
      topSellingPizzas,
      recentOrders,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Failed to fetch dashboard metrics",
      details: error.message,
    });
  }
};
