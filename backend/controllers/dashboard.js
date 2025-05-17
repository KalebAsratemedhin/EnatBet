import Order from '../models/order.js';
import mongoose from "mongoose";
import User from "../models/user.js";
import Restaurant from "../models/Restaurant.js";
import Delivery from "../models/delivery.js";
import DeliveryPerson from '../models/deliveryPerson.js';


export const getCustomerDashboard = async (req, res) => {
  try {
    const customerID = req.user.id; // assuming you use auth middleware

    // Match all orders for the customer
    const matchStage = { customerID: new mongoose.Types.ObjectId(customerID) };

    const [
      totalStats,
      monthlySpending,
      orderStatusDist,
      favoriteRestaurants,
      recentOrders,
    ] = await Promise.all([
      // 1. Total Orders, Total Money, Distinct Restaurants
      Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSpent: { $sum: "$totalAmount" },
            uniqueRestaurants: { $addToSet: "$restaurantID" },
          },
        },
        {
          $project: {
            _id: 0,
            totalOrders: 1,
            totalSpent: 1,
            restaurantsOrderedFrom: { $size: "$uniqueRestaurants" },
          },
        },
      ]),

      // 2. Monthly Spending
      Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            amount: { $sum: "$totalAmount" },
          },
        },
        {
          $project: {
            month: {
              $concat: [
                { $arrayElemAt: [
                  [ "", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ],
                  "$_id.month"
                ] },
                " ", { $toString: "$_id.year" }
              ]
            },
            amount: 1,
            _id: 0,
          },
        },
        { $sort: { month: 1 } },
      ]),

      // 3. Order Status Distribution
      Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$status",
            value: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            value: 1,
          },
        },
      ]),

      // 4. Favorite Restaurants by Order Count
      Order.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: "$restaurantID",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "restaurants",
            localField: "_id",
            foreignField: "_id",
            as: "restaurant",
          },
        },
        {
          $unwind: "$restaurant",
        },
        {
          $project: {
            _id: 0,
            name: "$restaurant.name",
            orders: "$count",
          },
        },
      ]),

      // 5. Recent Orders (last 5)
      Order.find({ customerID })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("restaurantID", "name")
        .select("status createdAt restaurantID")
        .lean()
        .then(orders =>
          orders.map(order => ({
            restaurant: order.restaurantID.name,
            status: order.status,
            time: order.status === "ready" ? "30 mins" : "—", // Adjust this logic
          }))
        ),
    ]);

    console.log("dashboard data ", {
        stats: totalStats[0] || { totalOrders: 0, totalSpent: 0, restaurantsOrderedFrom: 0 },
        monthlySpending,
        orderStatusDistribution: orderStatusDist,
        favoriteRestaurants,
        recentOrders,
      });
    
    res.status(200).json({
      stats: totalStats[0] || { totalOrders: 0, totalSpent: 0, restaurantsOrderedFrom: 0 },
      monthlySpending,
      orderStatusDistribution: orderStatusDist,
      favoriteRestaurants,
      recentOrders,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Failed to load dashboard data." });
  }
};




export const getDeliveryPersonDashboard = async (req, res) => {
  try {
    const person = await DeliveryPerson.findOne({userId: req.user.id});
    const deliveryPersonId = person._id;


    const deliveries = await Delivery.find({ deliveryPersonId })
      .populate("orderId")
      .sort({ estimatedDeliveryTime: -1 })
      .exec();

    const totalDeliveries = deliveries.length;

    const completed = deliveries.filter(d => d.status === "delivered").length;
    const cancelled = deliveries.filter(d => d.status === "failed").length;
    const pending = deliveries.filter(d => !["delivered", "failed"].includes(d.status)).length;

    
    const recentDeliveries = deliveries.slice(0, 5).map(d => ({
      id: d._id,
      order: d.orderId?.items?.[0]?.name || "Order",
      status: d.status === "delivered" ? "Completed" : d.status === "failed" ? "Cancelled" : "Pending",
      time: d.estimatedDeliveryTime
    }));

    res.json({
      totalDeliveries,
      deliveryData: [
        { name: "Completed", value: completed },
        { name: "Pending", value: pending },
        { name: "Cancelled", value: cancelled },
      ],
      recentDeliveries,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAdminDashboard = async (req, res) => {
  try {
    // 1. User counts by role
    const rolesAggregation = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    const totalCustomers = rolesAggregation.find(r => r._id === "customer")?.count || 0;
    const totalRestaurants = await Restaurant.countDocuments();
    const totalDeliveryPeople = rolesAggregation.find(r => r._id === "delivery_person")?.count || 0;

    // 2. User active/inactive distribution
    const userActivityAggregation = await User.aggregate([
      {
        $group: {
          _id: "$isActive",
          count: { $sum: 1 }
        }
      }
    ]);

    const activeUsers = userActivityAggregation.find(a => a._id === true)?.count || 0;
    const inactiveUsers = userActivityAggregation.find(a => a._id === false)?.count || 0;

    // 3. Revenue breakdown by order status
    const revenueAggregation = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const completedRevenue = revenueAggregation.find(r => r._id === "ready")?.totalRevenue || 0;
    const unpaidRevenue = revenueAggregation.find(r => r._id === "unpaid")?.totalRevenue || 0;
    const cancelledRevenue = revenueAggregation.find(r => r._id === "cancelled")?.totalRevenue || 0;

    // 4. Monthly sales trend (based on completed orders)
    const monthlySales = await Order.aggregate([
      {
        $match: {
          status: "ready",
          createdAt: { $gte: new Date(new Date().getFullYear(), 0, 1) } // from Jan 1 this year
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sales: { $sum: "$totalAmount" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const monthNames = [
      "", "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const salesData = monthlySales.map(entry => ({
      name: monthNames[entry._id],
      sales: entry.sales
    }));

    // 5. Recent users (last 5 by creation)
    const recentUsers = await User.find()
      .sort({ _id: -1 })
      .limit(5)
      .select("_id name email role isActive");



    console.log("res dasgs ", {
        stats: {
          totalCustomers,
          totalRestaurants,
          totalDeliveryPeople
        },
        userData: [
          { name: "Active Users", value: activeUsers },
          { name: "Inactive Users", value: inactiveUsers }
        ],
        revenueData: [
          { name: "Completed Orders", value: completedRevenue },
          { name: "Pending Orders", value: unpaidRevenue },
          { name: "Cancelled Orders", value: cancelledRevenue }
        ],
        salesData,
        recentUsers
      });
    

    return res.status(200).json({
      stats: {
        totalCustomers,
        totalRestaurants,
        totalDeliveryPeople
      },
      userData: [
        { name: "Active Users", value: activeUsers },
        { name: "Inactive Users", value: inactiveUsers }
      ],
      revenueData: [
        { name: "Completed Orders", value: completedRevenue },
        { name: "Pending Orders", value: unpaidRevenue },
        { name: "Cancelled Orders", value: cancelledRevenue }
      ],
      salesData,
      recentUsers
    });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res.status(500).json({ error: "Server error fetching dashboard data" });
  }
};

export const getRestaurantOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const restaurants = await Restaurant.find({ ownerId }).lean();

    if (restaurants.length === 0) {
      return res.json({
        totalSales: 0,
        totalOrders: 0,
        restaurantCount: 0,
        salesOverTime: [],
        salesShare: [],
        ordersPerRestaurant: [],
        customersPerRestaurant: [],
      });
    }

    const restaurantIds = restaurants.map(r => r._id);

    const orders = await Order.find({ restaurantID: { $in: restaurantIds } })
      .select("restaurantID totalAmount createdAt customerID")
      .lean();

    // Stats
    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const restaurantCount = restaurants.length;

    // Group by restaurant for share
    const salesByRestaurant = {};
    const ordersByRestaurant = {};
    const customersByRestaurant = {};

    restaurants.forEach(r => {
      salesByRestaurant[r._id.toString()] = 0;
      ordersByRestaurant[r._id.toString()] = 0;
      customersByRestaurant[r._id.toString()] = new Set();
    });

    orders.forEach(order => {
      const rid = order.restaurantID.toString();
      salesByRestaurant[rid] += order.totalAmount || 0;
      ordersByRestaurant[rid]++;
      customersByRestaurant[rid].add(order.customerID.toString());
    });

    const salesShare = restaurants.map(r => ({
      name: r.name,
      value: salesByRestaurant[r._id.toString()],
    }));

    const ordersPerRestaurant = restaurants.map(r => ({
      name: r.name,
      orders: ordersByRestaurant[r._id.toString()],
    }));

    const customersPerRestaurant = restaurants.map(r => ({
      name: r.name,
      customers: customersByRestaurant[r._id.toString()].size,
    }));

    // Group sales over time (monthly)
    const monthlySales = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const month = date.toLocaleString("default", { month: "short" }); // e.g., Jan
      const rid = order.restaurantID.toString();
      const restaurant = restaurants.find(r => r._id.toString() === rid);
      if (!restaurant) return;

      if (!monthlySales[month]) {
        monthlySales[month] = {};
      }

      monthlySales[month][restaurant.name] = (monthlySales[month][restaurant.name] || 0) + order.totalAmount;
    });

    const salesOverTime = Object.entries(monthlySales).map(([month, data]) => ({
      date: month,
      ...data,
    }));

    return res.json({
      totalSales,
      totalOrders,
      restaurantCount,
      salesOverTime,
      salesShare,
      ordersPerRestaurant,
      customersPerRestaurant,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ error: "Server error while fetching dashboard data" });
  }
};
