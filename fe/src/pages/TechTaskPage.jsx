import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Hàm lấy class CSS cho badge trạng thái
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "new":
      return "status-badge new";
    case "in-progress":
      return "status-badge in-progress";
    case "pending":
      return "status-badge pending";
    case "completed":
      return "status-badge completed";
    case "cancelled":
      return "status-badge cancelled";
    default:
      return "status-badge";
  }
};

// Hàm hiển thị tên trạng thái tiếng Việt
const getStatusLabel = (status) => {
  switch (status) {
    case "new":
      return "Mới";
    case "in-progress":
      return "Đang xử lý";
    case "pending":
      return "Chờ phụ kiện";
    case "completed":
      return "Hoàn thành";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

function TechTaskPage() {
  const [tasks, setTasks] = useState([]);
  const [techStaff, setTechStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({
    task_type: "",
    note: "",
    user_id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, staffRes] = await Promise.all([
        axios.get(`${API_URL}/tasks`),
        axios.get(`${API_URL}/tasks/staff`),
      ]);

      if (tasksRes.data.success) setTasks(tasksRes.data.data);
      if (staffRes.data.success) setTechStaff(staffRes.data.data);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignChange = async (taskId, newUserId) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { user_id: newUserId });
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId ? { ...t, user_id: parseInt(newUserId) } : t
        )
      );
      alert("Đã phân công thành công!");
    } catch (error) {
      alert("Lỗi khi phân công: " + error.message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await axios.put(`${API_URL}/tasks/${taskId}`, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (error) {
      alert("Lỗi cập nhật trạng thái");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/tasks`, newTask);
      if (res.data.success) {
        alert("Tạo task thành công!");
        setShowModal(false);
        setNewTask({ task_type: "", note: "", user_id: "" });
        fetchData();
      }
    } catch (error) {
      alert("Lỗi tạo task");
    }
  };

  // Lọc task theo trạng thái
  const filteredTasks = tasks.filter((task) =>
    filterStatus === "all" ? true : task.status === filterStatus
  );

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <i className="fas fa-tools"></i> Quản Lý Task Kỹ Thuật
        </h1>
        <div className="header-actions">
          <div className="filter-dropdown">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Mới</option>
              <option value="in-progress">Đang xử lý</option>
              <option value="pending">Chờ phụ kiện</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>
          <button className="btn-add-task" onClick={() => setShowModal(true)}>
            <i className="fas fa-plus"></i> Tạo task mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="task-stats">
        <div className="stat-card">
          <div className="stat-value">
            {tasks.filter((t) => t.status === "new").length}
          </div>
          <div className="stat-label">Task mới</div>
          <div className="stat-icon new">
            <i className="fas fa-exclamation-circle"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {tasks.filter((t) => t.status === "in-progress").length}
          </div>
          <div className="stat-label">Đang xử lý</div>
          <div className="stat-icon in-progress">
            <i className="fas fa-spinner"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {tasks.filter((t) => t.status === "pending").length}
          </div>
          <div className="stat-label">Chờ phụ kiện</div>
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {tasks.filter((t) => t.status === "completed").length}
          </div>
          <div className="stat-label">Hoàn thành</div>
          <div className="stat-icon completed">
            <i className="fas fa-check-circle"></i>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="tasks-table-container">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loại Task / Tiêu đề</th>
              <th>Ghi chú / Mô tả</th>
              <th>Ngày tạo</th>
              <th>Người xử lý</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : filteredTasks.length === 0 ? (
              /* SỬA LỖI: Dùng filteredTasks thay vì tasks để bộ lọc hoạt động */
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  Chưa có task nào.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task /* SỬA LỖI: Dùng filteredTasks */) => (
                <tr key={task.id}>
                  <td>#{task.id}</td>
                  <td style={{ fontWeight: "bold" }}>{task.task_type}</td>
                  <td>{task.note}</td>
                  <td>
                    {new Date(task.created_at).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <select
                      className="assign-select"
                      value={task.user_id || ""}
                      onChange={(e) =>
                        handleAssignChange(task.id, e.target.value)
                      }
                    >
                      <option value="">-- Chưa gán --</option>
                      {techStaff.map((staff) => (
                        <option key={staff.id} value={staff.id}>
                          {staff.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(task.status)}>
                      {getStatusLabel(task.status)}
                    </span>
                  </td>

                  {/* === PHẦN ACTION BUTTONS ĐƯỢC KHÔI PHỤC === */}
                  <td>
                    <div className="action-buttons">
                      {/* Trạng thái Mới -> Bắt đầu (Đang xử lý) */}
                      {task.status === "new" && (
                        <button
                          className="btn-start"
                          title="Bắt đầu xử lý"
                          onClick={() =>
                            handleStatusChange(task.id, "in-progress")
                          }
                        >
                          <i className="fas fa-play"></i>
                        </button>
                      )}

                      {/* Trạng thái Đang xử lý -> Tạm dừng (Chờ phụ kiện) HOẶC Hoàn thành */}
                      {task.status === "in-progress" && (
                        <>
                          <button
                            className="btn-pause"
                            title="Chờ phụ kiện"
                            onClick={() =>
                              handleStatusChange(task.id, "pending")
                            }
                          >
                            <i className="fas fa-pause"></i>
                          </button>
                          <button
                            className="btn-complete"
                            title="Hoàn thành"
                            onClick={() =>
                              handleStatusChange(task.id, "completed")
                            }
                          >
                            <i className="fas fa-check"></i>
                          </button>
                        </>
                      )}

                      {/* Trạng thái Chờ phụ kiện -> Tiếp tục (Đang xử lý) */}
                      {task.status === "pending" && (
                        <button
                          className="btn-start"
                          title="Tiếp tục xử lý"
                          onClick={() =>
                            handleStatusChange(task.id, "in-progress")
                          }
                        >
                          <i className="fas fa-play"></i>
                        </button>
                      )}

                      {/* Trạng thái Hoàn thành -> Làm lại (Mở lại task nếu cần) */}
                      {task.status === "completed" && (
                        <button
                          className="btn-reopen"
                          title="Làm lại"
                          onClick={() =>
                            handleStatusChange(task.id, "in-progress")
                          }
                        >
                          <i className="fas fa-redo"></i>
                        </button>
                      )}
                    </div>
                  </td>
                  {/* === HẾT PHẦN ACTION BUTTONS === */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL TẠO TASK */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>Tạo Task Mới</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label>
                  Loại Task / Tiêu đề <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  value={newTask.task_type}
                  onChange={(e) =>
                    setNewTask({ ...newTask, task_type: e.target.value })
                  }
                  placeholder="Ví dụ: Sửa lỗi nguồn Laptop..."
                />
              </div>
              <div className="form-group" style={{ marginBottom: "10px" }}>
                <label>Ghi chú chi tiết</label>
                <textarea
                  rows="3"
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  value={newTask.note}
                  onChange={(e) =>
                    setNewTask({ ...newTask, note: e.target.value })
                  }
                ></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label>Gán cho nhân viên (Tùy chọn)</label>
                <select
                  style={{ width: "100%", padding: "8px", marginTop: "5px" }}
                  value={newTask.user_id}
                  onChange={(e) =>
                    setNewTask({ ...newTask, user_id: e.target.value })
                  }
                >
                  <option value="">-- Chọn sau --</option>
                  {techStaff.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: "8px 15px",
                    background: "#e74c3c",
                    color: "white",
                    border: "none",
                  }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    background: "#3498db",
                    color: "white",
                    border: "none",
                  }}
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TechTaskPage;
