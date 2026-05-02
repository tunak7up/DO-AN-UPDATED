import React, { useState, useEffect } from "react";

const AdjustStockModal = ({ isOpen, onClose, onSave, storeId, currentQuantity, productName }) => {
  const [formData, setFormData] = useState({
    quantity: currentQuantity || 0,
    reason: "",
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        quantity: currentQuantity || 0,
        reason: "",
      });
    }
  }, [isOpen, currentQuantity]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNaN(parseInt(formData.quantity)) || parseInt(formData.quantity) < 0) {
      alert("Số lượng phải là một số nguyên dương hợp lệ.");
      return;
    }
    onSave(storeId, formData.quantity, formData.reason);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '400px' }}>
        <div className="modal-header">
          <h2>Điều chỉnh tồn kho</h2>
          <button className="close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Sản phẩm:</label>
            <input type="text" value={productName || ""} disabled style={{ width: '100%', padding: '8px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Cơ sở (Store ID):</label>
            <input type="text" value={storeId || ""} disabled style={{ width: '100%', padding: '8px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Số lượng cũ:</label>
            <input type="text" value={currentQuantity} disabled style={{ width: '100%', padding: '8px', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px' }} />
          </div>

          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Số lượng mới <span className="required">*</span></label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Lý do điều chỉnh <span className="required">*</span></label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Vd: Kiểm kê định kỳ bị lệch, Hàng hỏng..."
              required
              rows="3"
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="btn-save">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdjustStockModal;
