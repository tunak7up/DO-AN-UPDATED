const { Order, OrderItem, Product, User, OrderHistory } = require("../models");

// Lấy danh sách đơn hàng được gán cho Shipper
exports.getMyAssignedOrders = async (req, res) => {
  try {
    const shipperId = req.user.id;

    const orders = await Order.findAll({
      where: { shipper_id: shipperId },
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
        {
          model: OrderHistory,
          as: "histories",
          include: [{ model: User, as: "changer", attributes: ["id", "name"] }],
          order: [["created_at", "DESC"]],
        },
      ],
      order: [["order_date", "DESC"]],
    });

    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("Lỗi lấy danh sách đơn giao:", error);
    res
      .status(500)
      .json({ success: false, message: "Lỗi lấy danh sách đơn giao hàng." });
  }
};

// Cập nhật trạng thái giao hàng
exports.updateShippingStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { action, note } = req.body;
    const shipperId = req.user.id;

    // Các action hợp lệ
    const validActions = [
      "assigned",
      "picked_up",
      "delivered",
      "failed",
      "notdelivered",
    ];
    if (!validActions.includes(action)) {
      return res
        .status(400)
        .json({ success: false, message: "Hành động không hợp lệ." });
    }

    const order = await Order.findOne({
      where: { id: orderId, shipper_id: shipperId },
    });
    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Không tìm thấy đơn hàng hoặc bạn không được phân công giao đơn này.",
      });
    }

    // Lưu lại trạng thái cũ
    let oldStatus = order.status;
    let oldPaymentStatus = order.payment_status;

    // Cập nhật trạng thái tổng của đơn hàng tùy theo hành động
    let newStatus = order.status;
    let newPaymentStatus = order.payment_status;

    if (action === "picked_up") {
      newStatus = "Shipping";
    } else if (action === "delivered") {
      newStatus = "Completed";
      // Nếu COD thì thu tiền xong -> Paid
      if (order.payment_method === "cod") {
        newPaymentStatus = "Paid";
      }
    } else if (action === "failed") {
      newStatus = "Cancelled"; // Hoặc tạo thêm trạng thái 'Failed Delivery', tạm để 'Cancelled'
    } else if (action === "notdelivered") {
      newStatus = "Not_Delivered";
    }

    await order.update({ status: newStatus, payment_status: newPaymentStatus });

    // Lưu vết Lịch sử vào OrderHistory (thay cho ShippingLog cũ)
    const log = await OrderHistory.create({
      order_id: order.id,
      changed_by_user_id: shipperId,
      old_status: oldStatus,
      new_status: newStatus,
      old_payment_status: oldPaymentStatus,
      new_payment_status: newPaymentStatus,
      note: note ? `[${action}] ${note}` : `[${action}]`,
    });

    res.json({
      success: true,
      message: "Cập nhật trạng thái giao hàng thành công.",
      data: log,
    });
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái giao hàng:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi hệ thống khi cập nhật giao hàng.",
    });
  }
};
