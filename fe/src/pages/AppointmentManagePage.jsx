import { API_URL, BASE_URL } from "../api.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const EditAppointmentModal = ({
  appointment,
  technicians,
  isOpen,
  onClose,
  onSave,
  userRole,
  histories,
}) => {
  const [formData, setFormData] = useState({
    status: "",
    payment_status: "",
    technician_id: "",
  });

  useEffect(() => {
    if (appointment) {
      setFormData({
        status: appointment.status || "pending",
        payment_status: appointment.payment_status || "Unpaid",
        technician_id: appointment.technician_id || "",
      });
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "technician_id") {
        if (value && newData.status === "pending") {
          newData.status = "assigned";
        } else if (!value && newData.status === "assigned") {
          newData.status = "pending";
        }
      }
      return newData;
    });
  };

  const formatDateStr = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = () => {
    onSave({
      id: appointment.id,
      status: formData.status,
      payment_status: formData.payment_status,
      technician_id: formData.technician_id
        ? parseInt(formData.technician_id)
        : null,
    });
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        className="modal-content"
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "8px",
          width: "500px",
          maxWidth: "90%",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>
          Cập nhật Đặt lịch #{appointment.id}
        </h2>

        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#f8f9fa",
            borderRadius: "5px",
          }}
        >
          <p>
            <strong>Khách hàng:</strong> {appointment.customer?.name} (
            {appointment.customer?.phone})
          </p>
          <p>
            <strong>Dịch vụ:</strong> {appointment.service?.name}
          </p>
          <p>
            <strong>Thời gian tới:</strong>{" "}
            {formatDateStr(appointment.appointment_time)}
          </p>
          <p>
            <strong>Mô tả lỗi:</strong> {appointment.note || "Không có ghi chú"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Trạng thái Đặt lịch
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={userRole === "ROLE_CASHIER"}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="pending" disabled={!!formData.technician_id}>
                Chờ xác nhận
              </option>
              <option value="assigned" disabled>
                Đã phân công
              </option>
              <option value="in_progress">Đang xử lý</option>
              <option value="completed">Đã hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>

          <div className="form-group" style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Thanh toán
            </label>
            <select
              name="payment_status"
              value={formData.payment_status}
              onChange={handleChange}
              disabled={userRole === "ROLE_TECHNICAL_STAFF"}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            >
              <option value="Unpaid">Chưa thanh toán</option>
              <option value="Paid">Đã thanh toán</option>
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Phân công Kỹ thuật viên
          </label>
          <select
            name="technician_id"
            value={formData.technician_id || ""}
            onChange={handleChange}
            disabled={userRole === "ROLE_CASHIER"}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Chưa phân công --</option>
            {technicians.map((tech) => (
              <option key={tech.id} value={tech.id}>
                {tech.name} ({tech.phone || "Chưa có SĐT"})
              </option>
            ))}
          </select>
        </div>

        <h3
          style={{
            fontSize: "14px",
            marginBottom: "10px",
            marginTop: "20px",
            color: "#333",
          }}
        >
          <i className="fas fa-history"></i> Lịch sử cập nhật
        </h3>
        <div
          style={{
            background: "#f9f9f9",
            padding: "10px",
            borderRadius: "5px",
            maxHeight: "100px",
            overflowY: "auto",
            fontSize: "13px",
          }}
        >
          {histories.length === 0 ? (
            <p style={{ color: "#666", margin: 0 }}>Chưa có lịch sử nào.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {histories.map((h) => (
                <li
                  key={h.id}
                  style={{
                    marginBottom: "5px",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "3px",
                  }}
                >
                  <strong>
                    {new Date(h.created_at).toLocaleString("vi-VN")}
                  </strong>{" "}
                  -
                  <span style={{ color: "#0056b3" }}>
                    {" "}
                    {h.changer?.name || "Ai đó"}
                  </span>
                  :
                  {h.old_status !== h.new_status &&
                    ` [Status: ${h.old_status || ""} ➡️ ${h.new_status}]`}
                  {h.old_payment_status !== h.new_payment_status &&
                    ` [T.Toán: ${h.old_payment_status || ""} ➡️ ${h.new_payment_status}]`}
                  {h.old_technician_id !== h.new_technician_id &&
                    ` [Phân công đổi]`}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div
          className="modal-actions"
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              background: "#e0e0e0",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            style={{
              padding: "10px 16px",
              cursor: "pointer",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
            onClick={handleSave}
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

function AppointmentManagePage() {
  const [appointments, setAppointments] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [histories, setHistories] = useState([]);
  const { user } = useAuth();
  const userRole = user?.role || user?.role_name || "ROLE_ADMIN";

  useEffect(() => {
    fetchData();
  }, []);

  const getAuthHeaders = () => {
    const currentToken = localStorage.getItem("token");
    return {
      headers: { Authorization: `Bearer ${currentToken}` },
    };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [appRes, techRes] = await Promise.all([
        axios.get(`${API_URL}/appointments`, getAuthHeaders()),
        axios.get(`${API_URL}/users/technicians`, getAuthHeaders()), // technicians could be generic, but we send headers anyway
      ]);

      if (appRes.data.success) {
        setAppointments(appRes.data.data);
      }
      if (techRes.data.success) {
        setTechnicians(techRes.data.data);
      }
    } catch (err) {
      console.error("Lỗi lấy dữ liệu đặt lịch:", err);
      // alert("Lỗi tải dữ liệu. Bạn có quyền Admin không?");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (appointment) => {
    setEditingAppointment(appointment);
    setHistories([]);
    try {
      const res = await axios.get(
        `${API_URL}/appointments/${appointment.id}/history`,
        getAuthHeaders(),
      );
      if (res.data.success) {
        setHistories(res.data.data);
      }
    } catch (err) {
      console.log("Lỗi lấy lịch sử:", err);
    }
  };

  const handleSaveAppointment = async (updateData) => {
    try {
      const response = await axios.put(
        `${API_URL}/appointments/${updateData.id}`,
        updateData,
        getAuthHeaders(),
      );
      if (response.data.success) {
        alert("Cập nhật thành công!");
        setAppointments(
          appointments.map((a) =>
            a.id === updateData.id ? response.data.data : a,
          ),
        );
        setEditingAppointment(null);
      }
    } catch (error) {
      console.error("Lỗi cập nhật lịch:", error);
      alert("Cập nhật thất bại!");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: "#fff3cd",
              color: "#856404",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Chờ xác nhận
          </span>
        );
      case "assigned":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: "#cce5ff",
              color: "#004085",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Đã phân công
          </span>
        );
      case "in_progress":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: "#d1ecf1",
              color: "#0c5460",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Đang xử lý
          </span>
        );
      case "completed":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: "#d4edda",
              color: "#155724",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Đã hoàn thành
          </span>
        );
      case "cancelled":
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              backgroundColor: "#f8d7da",
              color: "#721c24",
              fontSize: "12px",
              fontWeight: "bold",
            }}
          >
            Đã hủy
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container" style={{ padding: "20px" }}>
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>
          <i className="fas fa-calendar-alt"></i> Quản Lý Lịch Hẹn
        </h1>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fff",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <thead style={{ backgroundColor: "#f4f4f4" }}>
              <tr>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Khách hàng
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Dịch vụ
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Thời gian tới
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Kỹ thuật viên
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Thanh toán
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Trạng thái
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  Hành Động
                </th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => (
                <tr key={app.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{app.id}</td>
                  <td style={{ padding: "12px" }}>
                    <div style={{ fontWeight: "bold" }}>
                      {app.customer?.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "#666" }}>
                      {app.customer?.phone}
                    </div>
                    <div style={{ fontSize: "13px", color: "#666" }}>
                      {app.customer?.email}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      fontWeight: "bold",
                      color: "#d93025",
                    }}
                  >
                    {app.service?.name}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {formatDate(app.appointment_time)}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {app.technician ? (
                      <span style={{ color: "#0056b3", fontWeight: "bold" }}>
                        <i
                          className="fas fa-tools"
                          style={{ marginRight: "5px" }}
                        ></i>
                        {app.technician.name}
                      </span>
                    ) : (
                      <span style={{ color: "#999", fontStyle: "italic" }}>
                        Chưa phân công
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {app.payment_status === "Paid" ? (
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        Đã thanh toán
                      </span>
                    ) : (
                      <span style={{ color: "red", fontWeight: "bold" }}>
                        Chưa thanh toán
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {getStatusBadge(app.status)}
                  </td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    <button
                      onClick={() => handleEditClick(app)}
                      style={{
                        border: "none",
                        background: "#f5f5f5",
                        color: "#333",
                        cursor: "pointer",
                        fontSize: "14px",
                        padding: "6px 12px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                      }}
                      title="Sửa / Phân công"
                    >
                      <i
                        className="fas fa-edit"
                        style={{ marginRight: "5px" }}
                      ></i>{" "}
                      Sửa
                    </button>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      padding: "30px",
                      textAlign: "center",
                      color: "#888",
                    }}
                  >
                    Chưa có đơn đặt lịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditAppointmentModal
        appointment={editingAppointment}
        technicians={technicians}
        isOpen={!!editingAppointment}
        onClose={() => setEditingAppointment(null)}
        onSave={handleSaveAppointment}
        userRole={userRole}
        histories={histories}
      />
    </div>
  );
}

export default AppointmentManagePage;
