const sequelize = require("../config/db");
const User = require("./User");
const Role = require("./Role");
const UserRole = require("./UserRole");
const Category = require("./Category");
const Product = require("./Product");
const Store = require("./Store");
const Inventory = require("./Inventory");
const Gallery = require("./Gallery");
const Feedback = require("./Feedback");
const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Order = require("./Order");
const OrderItem = require("./OrderItem");
const TechTask = require("./TechTask");
const ServiceCategory = require("./ServiceCategory");
const Service = require("./Service");
const Appointment = require("./Appointment");
const StoreUser = require("./StoreUser");
const OrderHistory = require("./OrderHistory");
const AppointmentHistory = require("./AppointmentHistory");
const ImportReceipt = require("./ImportReceipt");
const ImportReceiptDetail = require("./ImportReceiptDetail");
const StockAdjustment = require("./StockAdjustment");
const ShippingLog = require("./ShippingLog");

// Định nghĩa quan hệ giữa các model

// User - Role (Many-to-Many)
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "user_id",
  otherKey: "role_id",
  as: "roles",
});
Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "role_id",
  otherKey: "user_id",
  as: "users",
});

// Category - Product (One-to-Many)
Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

// Product - Gallery (One-to-Many)
Product.hasMany(Gallery, { foreignKey: "product_id", as: "galleries" });
Gallery.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product - Feedback (One-to-Many)
Product.hasMany(Feedback, { foreignKey: "product_id", as: "feedbacks" });
Feedback.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Product - Inventory - Store (Many-to-Many)
Product.belongsToMany(Store, {
  through: Inventory,
  foreignKey: "product_id",
  otherKey: "store_id",
  as: "stores",
});
Store.belongsToMany(Product, {
  through: Inventory,
  foreignKey: "store_id",
  otherKey: "product_id",
  as: "products",
});
Product.hasMany(Inventory, { foreignKey: "product_id", as: "inventories" });
Inventory.belongsTo(Product, { foreignKey: "product_id", as: "product" });
Store.hasMany(Inventory, { foreignKey: "store_id", as: "inventories" });
Inventory.belongsTo(Store, { foreignKey: "store_id", as: "store" });

// User - Cart (One-to-One)
User.hasOne(Cart, { foreignKey: "user_id", as: "cart" });
Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Cart - CartItem - Product
Cart.hasMany(CartItem, { foreignKey: "cart_id", as: "items" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id", as: "cart" });
Product.hasMany(CartItem, { foreignKey: "product_id", as: "cartItems" });
CartItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// User - Order (One-to-Many)
User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Shipper - Order
User.hasMany(Order, { foreignKey: "shipper_id", as: "shippingOrders" });
Order.belongsTo(User, { foreignKey: "shipper_id", as: "shipper" });

// Order - ShippingLog
Order.hasMany(ShippingLog, { foreignKey: "order_id", as: "shippingLogs" });
ShippingLog.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// Order - OrderItem - Product
Order.hasMany(OrderItem, { foreignKey: "order_id", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
Product.hasMany(OrderItem, { foreignKey: "product_id", as: "orderItems" });
OrderItem.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// User - TechTask (One-to-Many)
User.hasMany(TechTask, { foreignKey: "user_id", as: "assignedTasks" });
TechTask.belongsTo(User, { foreignKey: "user_id", as: "assignee" });

// ServiceCategory - Service (One-to-Many)
ServiceCategory.hasMany(Service, { foreignKey: "category_id", as: "services" });
Service.belongsTo(ServiceCategory, {
  foreignKey: "category_id",
  as: "category",
});

// User - Appointment (One-to-Many)
User.hasMany(Appointment, { foreignKey: "user_id", as: "appointments" });
Appointment.belongsTo(User, { foreignKey: "user_id", as: "customer" });

// Service - Appointment (One-to-Many)
Service.hasMany(Appointment, { foreignKey: "service_id", as: "appointments" });
Appointment.belongsTo(Service, { foreignKey: "service_id", as: "service" });

// Store - Appointment (One-to-Many)
Store.hasMany(Appointment, { foreignKey: "store_id", as: "appointments" });
Appointment.belongsTo(Store, { foreignKey: "store_id", as: "store" });

// User (Technician) - Appointment (One-to-Many)
User.hasMany(Appointment, { foreignKey: "technician_id", as: "tasks" });
Appointment.belongsTo(User, { foreignKey: "technician_id", as: "technician" });

// Store - User (Many-to-Many cho quản lý kho)
Store.belongsToMany(User, {
  through: StoreUser,
  foreignKey: "store_id",
  otherKey: "user_id",
  as: "managers",
});
User.belongsToMany(Store, {
  through: StoreUser,
  foreignKey: "user_id",
  otherKey: "store_id",
  as: "managedStores",
});
StoreUser.belongsTo(Store, { foreignKey: "store_id", as: "store" });
StoreUser.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Order - OrderHistory (One-to-Many)
Order.hasMany(OrderHistory, { foreignKey: "order_id", as: "histories" });
OrderHistory.belongsTo(Order, { foreignKey: "order_id", as: "order" });

// User - OrderHistory (Người thay đổi)
User.hasMany(OrderHistory, {
  foreignKey: "changed_by_user_id",
  as: "changedOrders",
});
OrderHistory.belongsTo(User, {
  foreignKey: "changed_by_user_id",
  as: "changer",
});
OrderHistory.belongsTo(User, {
  foreignKey: "old_shipper_id",
  as: "old_shipper",
});
OrderHistory.belongsTo(User, {
  foreignKey: "new_shipper_id",
  as: "new_shipper",
});

// Appointment - AppointmentHistory (One-to-Many)
Appointment.hasMany(AppointmentHistory, {
  foreignKey: "appointment_id",
  as: "histories",
});
AppointmentHistory.belongsTo(Appointment, {
  foreignKey: "appointment_id",
  as: "appointment",
});

// User - AppointmentHistory (Người thay đổi)
User.hasMany(AppointmentHistory, {
  foreignKey: "changed_by_user_id",
  as: "changedAppointments",
});
AppointmentHistory.belongsTo(User, {
  foreignKey: "changed_by_user_id",
  as: "changer",
});

// User - ImportReceipt (Người tạo phiếu nhập)
User.hasMany(ImportReceipt, { foreignKey: "created_by", as: "importReceipts" });
ImportReceipt.belongsTo(User, { foreignKey: "created_by", as: "creator" });

// ImportReceipt - ImportReceiptDetail (Chi tiết phiếu nhập)
ImportReceipt.hasMany(ImportReceiptDetail, { foreignKey: "receipt_id", as: "details" });
ImportReceiptDetail.belongsTo(ImportReceipt, { foreignKey: "receipt_id", as: "receipt" });

// Product - ImportReceiptDetail
Product.hasMany(ImportReceiptDetail, { foreignKey: "product_id", as: "importDetails" });
ImportReceiptDetail.belongsTo(Product, { foreignKey: "product_id", as: "product" });

// Store - ImportReceiptDetail
Store.hasMany(ImportReceiptDetail, { foreignKey: "store_id", as: "importDetails" });
ImportReceiptDetail.belongsTo(Store, { foreignKey: "store_id", as: "store" });

// StockAdjustment Associations
Product.hasMany(StockAdjustment, { foreignKey: "product_id", as: "stockAdjustments" });
StockAdjustment.belongsTo(Product, { foreignKey: "product_id", as: "product" });

User.hasMany(StockAdjustment, { foreignKey: "adjusted_by", as: "stockAdjustments" });
StockAdjustment.belongsTo(User, { foreignKey: "adjusted_by", as: "adjuster" });

Store.hasMany(StockAdjustment, { foreignKey: "store_id", as: "stockAdjustments" });
StockAdjustment.belongsTo(Store, { foreignKey: "store_id", as: "store" });

// Sync database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: false });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Error syncing database:", error);
  }
};

module.exports = {
  sequelize,
  User,
  Role,
  UserRole,
  Category,
  Product,
  Store,
  Inventory,
  Gallery,
  Feedback,
  Cart,
  CartItem,
  Order,
  OrderItem,
  TechTask,
  ServiceCategory,
  Service,
  Appointment,
  StoreUser,
  OrderHistory,
  AppointmentHistory,
  ImportReceipt,
  ImportReceiptDetail,
  StockAdjustment,
  ShippingLog,
  syncDatabase,
};
