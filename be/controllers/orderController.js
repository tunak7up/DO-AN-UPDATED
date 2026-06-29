const { sequelize, Order, OrderItem, Product, Cart, CartItem, User, OrderHistory } = require('../models');

// Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "shipper",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "thumbnail"],
            },
          ],
        },
      ],
      order: [["order_date", "DESC"]],
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "shipper",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: OrderHistory,
          as: "histories",
          include: [{ model: User, as: "changer", attributes: ["id", "name"] }],
          order: [["created_at", "DESC"]],
        },
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "price", "thumbnail"],
            },
          ],
        },
      ],
    });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction(); // Bắt đầu giao dịch an toàn
  try {
    const {
      user_id,
      items, // Danh sách sản phẩm từ FE gửi lên
      shipping_info, // Object chứa thông tin giao hàng từ FE
      payment_method,
      note,
    } = req.body;

    // 1. Tính tổng tiền (Tính lại từ DB để bảo mật, tránh FE sửa giá)
    let total_amount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(
        item.product_id || item.product.id
      );
      if (!product) {
        throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại`);
      }

      // Tính giá sau giảm giá
      const price = product.price * (1 - (product.discount || 0) / 100);
      const lineTotal = price * item.quantity;
      total_amount += lineTotal;

      // Chuẩn bị dữ liệu cho OrderItem
      orderItemsData.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_order: price, // Lưu giá tại thời điểm mua
      });
    }

    // 2. Tạo Order (Map từ shipping_info sang các cột của bảng orders)
    const order = await Order.create(
      {
        user_id,
        order_date: new Date(),
        total_amount,
        status: "Pending",
        // Map dữ liệu phẳng
        receiver_name: shipping_info.fullName,
        shipping_phone: shipping_info.phone,
        shipping_address: shipping_info.address,
        shipping_city: shipping_info.city,
        shipping_district: shipping_info.district,
        payment_method,
        payment_status: "Unpaid",
        notes: note,
      },
      { transaction }
    );

    // 3. Tạo các OrderItem
    const itemsToCreate = orderItemsData.map((item) => ({
      ...item,
      order_id: order.id,
    }));
    await OrderItem.bulkCreate(itemsToCreate, { transaction });

    // 4. XÓA GIỎ HÀNG (Quan trọng)
    const cart = await Cart.findOne({ where: { user_id } });
    if (cart) {
      await CartItem.destroy({
        where: { cart_id: cart.id },
        transaction,
      });
    }

    // 5. Commit transaction (Lưu tất cả vào DB)
    await transaction.commit();

    // 6. Lấy lại đơn hàng đầy đủ để trả về Frontend
    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "thumbnail"],
            },
          ],
        },
      ],
    });

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    // Nếu có lỗi, hoàn tác tất cả
    await transaction.rollback();
    console.error("Lỗi tạo đơn hàng:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Tạo đơn hàng bởi Nhân viên (POS)
exports.createStaffOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { items, shipping_info, payment_method, note } = req.body;
    
    // Hardcode user_id = 34 cho mọi đơn hàng khách lẻ tới cửa hàng
    const user_id = 34;

    let total_amount = 0;
    const orderItemsData = [];

    for (const item of items) {
      const product = await Product.findByPk(item.product_id || item.product.id);
      if (!product) throw new Error(`Sản phẩm ID ${item.product_id} không tồn tại`);

      const price = product.price * (1 - (product.discount || 0) / 100);
      total_amount += price * item.quantity;

      orderItemsData.push({
        product_id: product.id,
        quantity: item.quantity,
        price_at_order: price,
      });
    }

    // Đơn tạo bởi nhân viên tại quầy mặc định phí ship = 0đ
    const shipping_fee = 0;
    total_amount += shipping_fee;

    // Tạo Order
    const order = await Order.create(
      {
        user_id,
        order_date: new Date(),
        total_amount,
        status: "Pending", // Staff order có thể Pending hoặc Completed tuỳ nghiệp vụ, mặc định Pending
        receiver_name: shipping_info.fullName,
        shipping_phone: shipping_info.phone,
        shipping_address: shipping_info.address || "Mua tại cửa hàng",
        shipping_city: shipping_info.city || "N/A",
        shipping_district: shipping_info.district || "N/A",
        payment_method,
        payment_status: "Unpaid", // Nếu staff chọn thanh toán ngay có thể cập nhật sau
        notes: note,
      },
      { transaction }
    );

    const itemsToCreate = orderItemsData.map((item) => ({ ...item, order_id: order.id }));
    await OrderItem.bulkCreate(itemsToCreate, { transaction });

    await transaction.commit();

    const createdOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [{ model: Product, as: "product", attributes: ["id", "title", "thumbnail"] }],
        },
      ],
    });

    res.status(201).json({ success: true, data: createdOrder });
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback();
    }
    console.error("Lỗi tạo đơn hàng POS (Lỗi gốc):", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng kèm RBAC và History
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, payment_status } = req.body;
    const userRole = req.user.role;
    const userId = req.user.id; // Người thực hiện

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const old_status = order.status;
    const old_payment_status = order.payment_status;

    let new_status = status !== undefined ? status : old_status;
    let new_payment_status = payment_status !== undefined ? payment_status : old_payment_status;

    // Phân tích quyền
    if (userRole === 'ROLE_CASHIER') {
      // Thu ngân chỉ đổi thu tiền, không đổi status
      new_status = old_status;
    }

    // Nếu không có thay đổi nào
    if (old_status === new_status && old_payment_status === new_payment_status) {
      return res.json({ success: true, data: order, message: "Không có thay đổi" });
    }
    // Cập nhật db
    await order.update({ status: new_status, payment_status: new_payment_status });

    // Lưu vết Lịch sử
    await OrderHistory.create({
      order_id: order.id,
      changed_by_user_id: userId,
      old_status: old_status,
      new_status: new_status,
      old_payment_status: old_payment_status,
      new_payment_status: new_payment_status
    });

    res.json({ success: true, message: "Cập nhật thành công", data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Gán đơn hàng cho Shipper
exports.assignShipper = async (req, res) => {
  try {
    const { shipper_id } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const old_shipper_id = order.shipper_id;

    // Cập nhật shipper
    await order.update({ shipper_id });

    // Lưu vết Lịch sử vào OrderHistory
    await OrderHistory.create({
      order_id: order.id,
      changed_by_user_id: req.user ? req.user.id : null,
      old_status: order.status,
      new_status: order.status,
      old_payment_status: order.payment_status,
      new_payment_status: order.payment_status,
      old_shipper_id: old_shipper_id || null,
      new_shipper_id: shipper_id || null
    });

    res.json({ success: true, message: "Gán shipper thành công", data: order });
  } catch (error) {
    console.error("Lỗi gán shipper:", error);
    res.status(500).json({ success: false, message: "Lỗi hệ thống khi gán shipper." });
  }
};

// Lấy lịch sử biến động đơn hàng
exports.getOrderHistories = async (req, res) => {
  try {
    const histories = await OrderHistory.findAll({
      where: { order_id: req.params.id },
      include: [
        { model: User, as: 'changer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'old_shipper', attributes: ['id', 'name'] },
        { model: User, as: 'new_shipper', attributes: ['id', 'name'] }
      ],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: histories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy đơn hàng theo user
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.params.userId },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "title", "thumbnail"],
            },
          ],
        },
      ],
      order: [["order_date", "DESC"]],
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Khách hàng tự hủy đơn
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    
    if (!order) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng của bạn." });
    }

    if (order.status !== 'Pending') {
      return res.status(400).json({ success: false, message: "Chỉ có thể hủy đơn hàng khi ở trạng thái Chờ xử lý." });
    }

    await order.update({ status: 'Cancelled' });

    // Ghi lại lịch sử
    await OrderHistory.create({
      order_id: order.id,
      changed_by_user_id: req.user.id,
      old_status: 'Pending',
      new_status: 'Cancelled',
      old_payment_status: order.payment_status,
      new_payment_status: order.payment_status,
      old_shipper_id: order.shipper_id,
      new_shipper_id: order.shipper_id,
    });

    res.json({ success: true, message: "Hủy đơn hàng thành công." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
