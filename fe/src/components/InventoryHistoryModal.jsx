import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../api.js';

const InventoryHistoryModal = ({ isOpen, onClose, product, storeId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      fetchHistory();
    }
  }, [isOpen, product, storeId]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const url = `${API_URL}/inventory/history/${product.id}${storeId !== 'all' ? `?storeId=${storeId}` : ''}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setHistory(response.data.data);
      } else {
        setError(response.data.message || 'Lỗi khi tải dữ liệu');
      }
    } catch (err) {
      console.error('Error fetching inventory history:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={styles.overlay}>
      <div className="modal-content" style={styles.content}>
        <div className="modal-header" style={styles.header}>
          <h2>Lịch sử kho hàng - {product?.title}</h2>
          <button className="btn-close" onClick={onClose} style={styles.closeBtn}>&times;</button>
        </div>
        
        <div className="modal-body" style={styles.body}>
          {loading ? (
            <p>Đang tải...</p>
          ) : error ? (
            <p style={{color: 'red'}}>{error}</p>
          ) : history.length === 0 ? (
            <p>Chưa có lịch sử cập nhật kho cho sản phẩm này.</p>
          ) : (
            <div style={styles.tableContainer}>
              <table className="inventory-history-table" style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Thời gian</th>
                    <th style={styles.th}>Loại</th>
                    <th style={styles.th}>Cơ sở</th>
                    <th style={styles.th}>Thay đổi</th>
                    <th style={styles.th}>Người thực hiện</th>
                    <th style={styles.th}>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map(item => (
                    <tr key={item.id} style={styles.tr}>
                      <td style={styles.td}>{new Date(item.created_at).toLocaleString('vi-VN')}</td>
                      <td style={styles.td}>
                        <span style={item.type === 'IMPORT' ? styles.badgeImport : styles.badgeAdjust}>
                          {item.type === 'IMPORT' ? 'Nhập kho' : 'Điều chỉnh'}
                        </span>
                      </td>
                      <td style={styles.td}>{item.store}</td>
                      <td style={styles.td}>
                        <span style={{color: item.quantity_change > 0 ? 'green' : item.quantity_change < 0 ? 'red' : 'black', fontWeight: 'bold'}}>
                          {item.quantity_change > 0 ? `+${item.quantity_change}` : item.quantity_change}
                        </span>
                      </td>
                      <td style={styles.td}>{item.user}</td>
                      <td style={styles.td}>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="modal-footer" style={styles.footer}>
          <button className="btn btn-secondary" onClick={onClose} style={styles.btnSecondary}>Đóng</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  content: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#666'
  },
  body: {
    padding: '20px',
    overflowY: 'auto'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left'
  },
  th: {
    padding: '12px',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f8f9fa'
  },
  tr: {
    borderBottom: '1px solid #eee'
  },
  td: {
    padding: '12px'
  },
  badgeImport: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  badgeAdjust: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  footer: {
    padding: '20px',
    borderTop: '1px solid #eee',
    textAlign: 'right'
  },
  btnSecondary: {
    padding: '8px 16px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  }
};

export default InventoryHistoryModal;
