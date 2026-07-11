import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Lấy hàm login từ Context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        // const role = result.user.role_name || result.user.role;
        // if (role === "ROLE_SHIPPER") {
        //   navigate("/admin/shipper");
        // } else if (role && role !== "ROLE_USER") {
        //   navigate("/admin/");
        // } else {
        // navigate("/");
        // }
        navigate("/");
      } else {
        setError(result.message);
      }
      // Nếu success thì AuthContext đã tự navigate rồi
    } catch (err) {
      setError("Đã có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "60vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="auth-box"
        style={{
          width: "100%",
          maxWidth: "400px",
          padding: "30px",
          boxShadow: "0 0 15px rgba(0,0,0,0.1)",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <h2
          style={{ textAlign: "center", marginBottom: "20px", color: "#333" }}
        >
          Đăng Nhập
        </h2>

        {error && (
          <div
            className="alert-error"
            style={{
              color: "red",
              marginBottom: "15px",
              textAlign: "center",
              background: "#ffe6e6",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Email
            </label>
            <div
              className="input-group"
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "0 10px",
              }}
            >
              <i
                className="fas fa-envelope"
                style={{ color: "#888", marginRight: "10px" }}
              ></i>
              <input
                type="email"
                required
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  padding: "10px 0",
                }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "5px" }}>
              Mật khẩu
            </label>
            <div
              className="input-group"
              style={{
                display: "flex",
                alignItems: "center",
                border: "1px solid #ddd",
                borderRadius: "4px",
                padding: "0 10px",
              }}
            >
              <i
                className="fas fa-lock"
                style={{ color: "#888", marginRight: "10px" }}
              ></i>
              <input
                type="password"
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  border: "none",
                  outline: "none",
                  padding: "10px 0",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <p>
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              style={{ color: "#e74c3c", fontWeight: "bold" }}
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
