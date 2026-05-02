const { TechTask, User, Role, UserRole } = require('../models');

// 1. Lấy tất cả Task (Đã kiểm tra kỹ phần include)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await TechTask.findAll({
      // Quan trọng: Phải khớp với alias 'assignee' đã định nghĩa trong models/index.js
      include: [{
        model: User,
        as: 'assignee', 
        attributes: ['id', 'name', 'email']
      }],
      order: [['created_at', 'DESC']]
    });
    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error("Lỗi getAllTasks:", error); // Log lỗi ra terminal để debug
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Tạo Task mới (Giữ nguyên)
exports.createTask = async (req, res) => {
  try {
    const { task_type, note, user_id } = req.body;
    
    // Nếu user_id là chuỗi rỗng "" thì chuyển thành null
    const assigneeId = user_id ? parseInt(user_id) : null;

    const newTask = await TechTask.create({
      task_type,
      note,
      user_id: assigneeId,
      status: 'new',
      created_at: new Date(),
      updated_at: new Date()
    });

    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Cập nhật Task (Giữ nguyên)
exports.updateTask = async (req, res) => {
  try {
    const { status, user_id, note } = req.body;
    const task = await TechTask.findByPk(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task không tồn tại' });
    }

    if (status) task.status = status;
    // Xử lý logic gán/bỏ gán người
    if (user_id !== undefined) {
        task.user_id = user_id ? parseInt(user_id) : null;
    }
    if (note) task.note = note;
    task.updated_at = new Date();

    await task.save();
    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Lấy danh sách Nhân viên Kỹ thuật (ĐÃ SỬA: Lọc theo role_id = 5)
exports.getTechnicalStaff = async (req, res) => {
  try {
    // Bước 1: Tìm tất cả user_id trong bảng trung gian có role_id = 5
    const staffIdsRaw = await UserRole.findAll({
      where: { role_id: 5 },
      attributes: ['user_id']
    });

    // Chuyển kết quả thành mảng các ID: [1, 2, 5...]
    const staffIds = staffIdsRaw.map(record => record.user_id);

    if (staffIds.length === 0) {
      return res.json({ success: true, data: [] });
    }

    // Bước 2: Lấy thông tin chi tiết User từ danh sách ID tìm được
    const techs = await User.findAll({
      where: {
        id: staffIds,     // Lọc theo danh sách ID
        enabled: true,    // Chỉ lấy user còn hoạt động
        deleted: 0        // Chưa bị xóa
      },
      attributes: ['id', 'name', 'email'] // Chỉ lấy thông tin cần thiết
    });

    res.json({ success: true, data: techs });
  } catch (error) {
    console.error("Lỗi getTechnicalStaff:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};