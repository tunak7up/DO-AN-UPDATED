import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const formatCurrency = (number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div
        className="container"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <h2>Giỏ hàng của bạn đang trống</h2>
        <Link to="/products" className="btn">
          Mua sắm ngay
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="checkout-progress">
        <div className="container">
          <div className="progress-steps">
            <div className="step active">
              <div className="step-number">1</div>
              <div className="step-title">Giỏ hàng</div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-title">Thông tin giao hàng</div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-title">Thanh toán</div>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <div className="step-title">Hoàn tất</div>
            </div>
          </div>
        </div>
      </section>

      <main className="cart-page">
        <div className="container">
          <h1 className="page-title">Giỏ hàng của bạn</h1>

          <div className="cart-container">
            <div className="cart-items">
              <div className="cart-header">
                <div className="header-product">Sản phẩm</div>
                <div className="header-price">Đơn giá</div>
                <div className="header-quantity">Số lượng</div>
                <div className="header-total">Số tiền</div>
                <div className="header-action">Thao tác</div>
              </div>

              {cart.items.map((item) => {
                const originalPrice = item.product.price;
                const discount = item.product.discount || 0;
                const currentPrice = originalPrice * (1 - discount / 100);

                return (
                  <div className="cart-item" key={item.id}>
                    <div className="item-product">
                      <div className="product-image">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                        />
                      </div>
                      <div className="product-info">
                        <Link to={`/product/${item.product.id}`}>
                          <h3 className="product-name">{item.product.title}</h3>
                        </Link>
                      </div>
                    </div>
                    <div className="item-price">
                      <div className="current-price">
                        {formatCurrency(currentPrice)}
                      </div>
                      {discount > 0 && (
                        <div className="old-price">
                          {formatCurrency(originalPrice)}
                        </div>
                      )}
                    </div>
                    <div className="item-quantity">
                      <div className="quantity-selector">
                        <button
                          className="quantity-btn minus"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <input type="number" value={item.quantity} readOnly />
                        <button
                          className="quantity-btn plus"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    </div>
                    <div className="item-total">
                      {formatCurrency(currentPrice * item.quantity)}
                    </div>
                    <div className="item-action">
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </div>
                );
              })}

              <div className="cart-actions">
                <Link to="/products" className="continue-shopping">
                  <i className="fas fa-arrow-left"></i> Tiếp tục mua hàng
                </Link>
              </div>
            </div>

            {/* Cart Summary */}
            <div className="cart-summary">
              <div className="summary-box">
                <h3 class="summary-title">Tóm tắt đơn hàng</h3>
                <div className="summary-row total">
                  <span>Tổng cộng</span>
                  <span className="total-price">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <Link to="/checkout" className="checkout-btn">
                  Tiến hành thanh toán
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default CartPage;
