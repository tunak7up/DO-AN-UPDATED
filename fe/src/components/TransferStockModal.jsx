import React, { useState, useEffect } from 'react';

const TransferStockModal = ({ isOpen, onClose, onSave, stores, product, myStoreIds, userRole }) => {
  const [fromStoreId, setFromStoreId] = useState('');
  const [toStoreId, setToStoreId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  // Chỉ lấy những kho đang có tồn kho > 0 để làm kho nguồn
  const availableFromStores = stores.filter(store => {
    const inv = product?.inventories?.find(i => i.store_id === store.id);
    return inv && inv.quantity > 0 && 
      // Kiểm tra quyền: Nếu là quản lý kho thì chỉ được xuất từ kho của mình
      (userRole !== 'ROLE_WAREHOUSE_MANAGER' || myStoreIds.includes(store.id));
  });

  // Khi chọn kho nguồn, tính toán số lượng tồn tối đa
  const maxQuantity = fromStoreId ? 
    product?.inventories?.find(i => i.store_id === parseInt(fromStoreId))?.quantity || 0 
    : 0;

  useEffect(() => {
    if (isOpen) {
      if (availableFromStores.length > 0) {
        setFromStoreId(availableFromStores[0].id.toString());
      } else {
        setFromStoreId('');
      }
      setToStoreId('');
      setQuantity(1);
      setReason('');
    }
  }, [isOpen, product]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fromStoreId || !toStoreId) {
      alert("Vui lòng chọn đầy đủ kho nguồn và kho đích.");
      return;
    }
    if (fromStoreId === toStoreId) {
      alert("Kho nguồn và kho đích không được trùng nhau.");
      return;
    }
    if (quantity <= 0 || quantity > maxQuantity) {
      alert("Số lượng điều chuyển không hợp lệ.");
      return;
    }
    onSave(fromStoreId, toStoreId, quantity, reason);
  };

  if (!isOpen || !product) return null;

  return (
    <div className="modal-overlay" style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    }}>
      <div className="modal-content" style={{ background: 'white', padding: '25px', borderRadius: '8px', width: '450px', maxWidth: '95%' }}>
        <h2 style={{ marginBottom: '15px' }}>Điều chuyển kho: {product.title}</h2>
        
        {availableFromStores.length === 0 ? (
            <div style={{ color: 'red', marginBottom: '15px' }}>
                Không có kho nào đủ điều kiện (có hàng và bạn có quyền xuất) để thực hiện điều chuyển.
            </div>
        ) : (
            <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Từ cơ sở (Nguồn):</label>
                <select 
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    value={fromStoreId} 
                    onChange={e => {
                        setFromStoreId(e.target.value);
                        setQuantity(1); // Reset số lượng
                    }}
                    required
                >
                <option value="">-- Chọn cơ sở nguồn --</option>
                {availableFromStores.map(store => {
                    const stock = product.inventories.find(i => i.store_id === store.id)?.quantity || 0;
                    return (
                        <option key={store.id} value={store.id}>{store.name} (Tồn: {stock})</option>
                    )
                })}
                </select>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Đến cơ sở (Đích):</label>
                <select 
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    value={toStoreId} 
                    onChange={e => setToStoreId(e.target.value)}
                    required
                >
                <option value="">-- Chọn cơ sở đích --</option>
                {stores.map(store => (
                    <option key={store.id} value={store.id} disabled={store.id.toString() === fromStoreId}>
                        {store.name}
                    </option>
                ))}
                </select>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Số lượng (Max: {maxQuantity}):</label>
                <input 
                    type="number" 
                    min="1" 
                    max={maxQuantity}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    required
                />
            </div>

            <div className="form-group" style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Lý do / Ghi chú:</label>
                <input 
                    type="text" 
                    placeholder="VD: Điều chuyển theo yêu cầu số 123"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={onClose} style={{ padding: '8px 15px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
                <button type="submit" style={{ padding: '8px 15px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Xác nhận điều chuyển</button>
            </div>
            </form>
        )}
        
        {availableFromStores.length === 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '15px' }}>
                <button type="button" onClick={onClose} style={{ padding: '8px 15px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Đóng</button>
            </div>
        )}
      </div>
    </div>
  );
};

export default TransferStockModal;
