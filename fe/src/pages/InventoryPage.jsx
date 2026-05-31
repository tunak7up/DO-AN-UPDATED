import { API_URL, BASE_URL } from '../api.js';
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import EditProductModal from "../components/EditProductModal";
import AdjustStockModal from "../components/AdjustStockModal";
import { useAuth } from '../context/AuthContext';
import { Link } from "react-router-dom";



// === Component con: Quản lý 1 dòng sản phẩm ===
// Tách ra cho dễ quản lý state
const ProductInventoryRow = ({ product, stores, filterStore, userRole, myStoreIds, onOpenAdjustModal }) => {

  const getHeaders = () => {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  };

  // Tính tổng kho
  const totalStock = useMemo(() => {
    return product.inventories.reduce((sum, item) => sum + item.quantity, 0);
  }, [product.inventories]);

  // Tìm số lượng của kho, trả về 0 nếu không có
  const getStockForStore = (storeId) => {
    const inventoryItem = product.inventories.find(
      (inv) => inv.store_id === storeId
    );
    return inventoryItem ? inventoryItem.quantity : 0;
  };

  // Xác định số lượng hiển thị dựa trên filter (nếu filter all thì lấy tổng, nếu cụ thể thì lấy của dòng của Cửa hàng đó)
  const displayQuantity = useMemo(() => {
    if (filterStore === 'all') return totalStock;
    return getStockForStore(parseInt(filterStore));
  }, [filterStore, product.inventories, totalStock]);

  const getStatus = () => {
    if (displayQuantity === 0) return { text: "Hết hàng", class: "out-of-stock" };
    if (displayQuantity <= 10) return { text: "Sắp hết", class: "low-stock" };
    return { text: "Còn hàng", class: "in-stock" };
  };
  const status = getStatus();

  // Xử lý khi bấm nút "Chỉnh sửa" để đẩy sự kiện lên cha mở Modal
  const handleEditClick = (storeId, currentQuantity, title) => {
    if (onOpenAdjustModal) {
      onOpenAdjustModal(product, storeId, currentQuantity);
    }
  };


  const canEdit = filterStore !== 'all' && (
      userRole === 'ROLE_ADMIN' || userRole === 'ROLE_DIRECTOR' || 
      (userRole === 'ROLE_WAREHOUSE_MANAGER' && myStoreIds.includes(parseInt(filterStore)))
  );

  return (
    <tr>
      <td>{product.id}</td> {/* Hoặc SKU nếu có */}
      <td>
        <div className="product-info">
          <div className="product-name">
            {product.title}
          </div>
          <div className="product-category">{product.category?.name}</div>
        </div>
      </td>
      <td>
        <div className="stock-quantity" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="quantity" style={{ fontWeight: 'bold' }}>{displayQuantity}</span>
          {canEdit && (
            <button
              className="btn-adjust"
              onClick={() =>
                handleEditClick(parseInt(filterStore), displayQuantity, product.title)
              }
              title="Điều chỉnh tồn kho"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <i style={{ color: "red" }} className="fa-solid fa-pen-to-square"></i> Sửa
            </button>
          )}
        </div>
      </td>
      <td>
        <span className={`status-badge ${status.class}`}>{status.text}</span>
      </td>
      {/* <td>
        <button className="btn-transfer">
          <i className="fas fa-exchange-alt"></i> Điều chuyển
        </button>
      </td> */}
    </tr>
  );
};

// === Component Cha: Trang Quản lý Kho ===
function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States cho bộ lọc
  const [filterSearch, setFilterSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStore, setFilterStore] = useState("all");
  
  const { user } = useAuth();
  const userRole = user?.role || user?.role_name || 'ROLE_ADMIN';
  const [myStoreIds, setMyStoreIds] = useState([]);

  // State cho Adjust Modal
  const [adjustModalData, setAdjustModalData] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Tải tất cả dữ liệu ban đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi 3 API song song
        const [productRes, categoryRes, storeRes] = await Promise.all([
          axios.get(`${API_URL}/products`), // Lấy products (đã có inventory)
          axios.get(`${API_URL}/categories`), // Lấy categories (cho filter)
          axios.get(`${API_URL}/stores`), // Lấy stores (cho filter)
        ]);

        if (productRes.data.success) setProducts(productRes.data.data);
        if (categoryRes.data.success) setCategories(categoryRes.data.data);
        if (storeRes.data.success) {
           let availableStores = storeRes.data.data;
           
           if (userRole === 'ROLE_WAREHOUSE_MANAGER' && user) {
             const headers = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
             try {
               const suRes = await axios.get(`${API_URL}/store-users`, headers);
               const myStores = suRes.data.data.filter(su => su.user_id === user.id).map(su => su.store_id);
               setMyStoreIds(myStores);
               availableStores = availableStores.filter(s => myStores.includes(s.id));
               if (myStores.length > 0) setFilterStore(myStores[0].toString());
             } catch(e) { console.log('Lấy store manager fail', e); }
           }
           
           setStores(availableStores);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Lọc danh sách sản phẩm (client-side)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // 1. Lọc theo search
      const matchesSearch = p.title
        .toLowerCase()
        .includes(filterSearch.toLowerCase());

      // 2. Lọc theo category
      const matchesCategory =
        filterCategory === "all" || p.category_id === parseInt(filterCategory);

      // 3. Lọc theo store (Sản phẩm có tồn kho > 0 tại store đã chọn)
      const matchesStore =
        filterStore === "all" ||
        p.inventories.some(
          (inv) => inv.store_id === parseInt(filterStore) && inv.quantity > 0
        );

      return matchesSearch && matchesCategory && matchesStore;
    });
  }, [products, filterSearch, filterCategory, filterStore]);

  const handleEditProductClick = (product) => {
    setEditingProduct(product);
  };

  const handleSaveProduct = async (updatedProduct) => {
    try {
      await axios.put(
        `${API_URL}/products/${updatedProduct.id}`,
        updatedProduct
      );

      // Cập nhật danh sách local
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === updatedProduct.id ? { ...p, ...updatedProduct } : p
        )
      );

      alert("Cập nhật thông tin sản phẩm thành công!");
      setEditingProduct(null);
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      alert(
        "Lỗi khi cập nhật sản phẩm: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  // Logic lưu dữ liệu Modal
  const handleSaveAdjustment = async (storeId, newQuantity, reason) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/inventory/quick-update/${adjustModalData.product.id}/${storeId}`,
        { quantity: parseInt(newQuantity), reason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Cập nhật lại local state
      setProducts((prevProducts) =>
        prevProducts.map((p) => {
          if (p.id === adjustModalData.product.id) {
            const newInventories = [...p.inventories];
            const invIndex = newInventories.findIndex((inv) => inv.store_id === storeId);
            if (invIndex > -1) {
              newInventories[invIndex].quantity = parseInt(newQuantity);
            } else {
              newInventories.push({
                product_id: p.id,
                store_id: storeId,
                quantity: parseInt(newQuantity),
              });
            }
            return { ...p, inventories: newInventories };
          }
          return p;
        })
      );

      alert("Cập nhật tồn kho thành công!");
      setAdjustModalData(null);
    } catch (err) {
      console.error("Lỗi cập nhật kho:", err);
      alert("Lỗi khi cập nhật kho: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading)
    return (
      <div className="container">
        <p>Đang tải dữ liệu kho...</p>
      </div>
    );
  if (error)
    return (
      <div className="container">
        <p>Lỗi: {error}</p>
      </div>
    );

  return (
    <div className="container">
      <div className="page-header">
        <h1>
          <i className="fas fa-boxes"></i> Quản Lý Kho Hàng
        </h1>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
            />
            <button>
              <i className="fas fa-search"></i>
            </button>
          </div>
          <div className="import-action" style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/admin/import" style={{ padding: '10px 15px', background: '#27ae60', color: 'white', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
              <i className="fas fa-file-import"></i> Nhập hàng
            </Link>
          </div>
          <div className="filter-dropdown">
            <select
              id="category-filter"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="store-filter">
            <select
              id="store-filter"
              value={filterStore}
              onChange={(e) => setFilterStore(e.target.value)}
              disabled={userRole === 'ROLE_WAREHOUSE_MANAGER' && myStoreIds.length <= 1} // Disable nếu chỉ có 1 kho
            >
              <option value="all" disabled={userRole === 'ROLE_WAREHOUSE_MANAGER'}>Tất cả cơ sở</option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Phần Summary (giữ nguyên HTML) */}
      <div className="inventory-summary">
        <div className="summary-card">
          <h3>Tổng Sản Phẩm</h3>
          <p className="summary-number">{products.length}</p>
        </div>
      </div>

      {/* Bảng Inventory */}
      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Sản phẩm</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              {/* <th>Thao tác</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <ProductInventoryRow
                key={product.id}
                product={product}
                stores={stores} // Truyền danh sách stores xuống
                filterStore={filterStore}
                onEditProduct={handleEditProductClick}
                onOpenAdjustModal={(product, storeId, currentQuantity) => 
                  setAdjustModalData({ product, storeId, currentQuantity })
                }
                userRole={userRole}
                myStoreIds={myStoreIds}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination (chưa làm logic) */}
      <div className="pagination"> </div>

      <EditProductModal
        product={editingProduct}
        categories={categories}
        isOpen={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleSaveProduct}
      />

      {adjustModalData && (
        <AdjustStockModal
          isOpen={true}
          onClose={() => setAdjustModalData(null)}
          onSave={handleSaveAdjustment}
          storeId={adjustModalData.storeId}
          currentQuantity={adjustModalData.currentQuantity}
          productName={adjustModalData.product.title}
        />
      )}
    </div>
  );
}

export default InventoryPage;
