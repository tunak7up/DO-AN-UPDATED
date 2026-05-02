const { Appointment, Service, Store, User, AppointmentHistory } = require('../models');

const appointmentController = {
  // Đặt lịch mới
  createAppointment: async (req, res) => {
    try {
      // req.user được gán từ middleware auth
      const user_id = req.user.id;
      const { service_id, store_id, appointment_time, note } = req.body;

      if (!service_id || !appointment_time) {
        return res.status(400).json({
          success: false,
          message: 'Vui lòng cung cấp dịch vụ và thời gian đặt lịch'
        });
      }

      // Lấy thông tin giá dịch vụ hiện tại để lưu vào price_at_booking
      const service = await Service.findByPk(service_id);
      if (!service) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy dịch vụ'
        });
      }

      const newAppointment = await Appointment.create({
        user_id,
        service_id,
        store_id: store_id || null,
        appointment_time,
        price_at_booking: service.price || 0,
        status: 'pending',
        note: note || null
      });

      res.status(201).json({
        success: true,
        message: 'Đặt lịch thành công',
        data: newAppointment
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi đặt lịch'
      });
    }
  },

  // Lấy lịch sử đặt lịch của user
  getUserAppointments: async (req, res) => {
    try {
      const user_id = req.user.id;
      const appointments = await Appointment.findAll({
        where: { user_id },
        include: [
          { model: Service, as: 'service' },
          { model: Store, as: 'store' }
        ],
        order: [['appointment_time', 'DESC']]
      });

      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy lịch sử đặt lịch'
      });
    }
  },

  // Admin: Lấy tất cả lịch đặt các khách hàng
  getAllAppointments: async (req, res) => {
    try {
      const appointments = await Appointment.findAll({
        include: [
          { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone'] },
          { model: Service, as: 'service' },
          { model: Store, as: 'store' },
          { model: User, as: 'technician', attributes: ['id', 'name', 'email', 'phone'] }
        ],
        order: [['id', 'DESC']]
      });

      res.json({
        success: true,
        data: appointments
      });
    } catch (error) {
      console.error('Error fetching all appointments:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi lấy tất cả danh sách đặt lịch'
      });
    }
  },

  // Lấy lịch sử biến động Appointment
  getAppointmentHistories: async (req, res) => {
    try {
      const histories = await AppointmentHistory.findAll({
        where: { appointment_id: req.params.id },
        include: [
          { model: User, as: 'changer', attributes: ['id', 'name', 'email'] }
        ],
        order: [['created_at', 'DESC']]
      });
      res.json({ success: true, data: histories });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Admin hoặc Kỹ thuật viên cập nhật lịch đặt
  updateAppointment: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, payment_status, technician_id, note } = req.body;
      const userRole = req.user.role;
      const userId = req.user.id;

      const appointment = await Appointment.findByPk(id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy lịch đặt'
        });
      }

      const old_status = appointment.status;
      const old_payment_status = appointment.payment_status;
      const old_technician_id = appointment.technician_id;
      const old_note = appointment.note;

      let new_status = status !== undefined ? status : old_status;
      let new_payment_status = payment_status !== undefined ? payment_status : old_payment_status;
      let new_technician_id = technician_id !== undefined ? technician_id : old_technician_id;
      let new_note = note !== undefined ? note : old_note;

      // Phân tích quyền
      if (userRole === 'ROLE_CASHIER') {
        new_status = old_status;
        new_technician_id = old_technician_id;
        new_note = old_note;
      } else if (userRole === 'ROLE_TECHNICAL_STAFF') {
        new_payment_status = old_payment_status;
      }

      // Check thay đổi
      if (
        old_status === new_status &&
        old_payment_status === new_payment_status &&
        old_technician_id == new_technician_id &&
        old_note === new_note
      ) {
        return res.json({ success: true, message: "Không có thay đổi", data: appointment });
      }

      await appointment.update({
        status: new_status,
        payment_status: new_payment_status,
        technician_id: new_technician_id,
        note: new_note
      });

      // Lưu vết Lịch sử
      await AppointmentHistory.create({
        appointment_id: appointment.id,
        changed_by_user_id: userId,
        old_status: old_status,
        new_status: new_status,
        old_payment_status: old_payment_status,
        new_payment_status: new_payment_status,
        old_technician_id: old_technician_id,
        new_technician_id: new_technician_id
      });

      // Lấy lại record mới đã có include để trả về FE
      const updatedAppointment = await Appointment.findByPk(id, {
        include: [
          { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone'] },
          { model: Service, as: 'service' },
          { model: Store, as: 'store' },
          { model: User, as: 'technician', attributes: ['id', 'name', 'email', 'phone'] }
        ]
      });

      res.json({
        success: true,
        message: 'Cập nhật lịch đặt thành công',
        data: updatedAppointment
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      res.status(500).json({
        success: false,
        message: 'Lỗi server khi cập nhật lịch đặt'
      });
    }
  }
};

module.exports = appointmentController;
