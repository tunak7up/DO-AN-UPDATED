const { Cart, CartItem, Product, Inventory } = require('../models');

// Lấy giỏ hàng của user
exports.getCartByUser = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: { user_id: req.params.userId },
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product',
          attributes: ['id', 'title', 'price', 'discount', 'thumbnail']
        }]
      }]
    });
    
    // Nếu chưa có giỏ hàng, tạo mới
    if (!cart) {
      cart = await Cart.create({
        user_id: req.params.userId,
        created_at: new Date()
      });
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;
    
    // Tìm hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ where: { user_id } });
    if (!cart) {
      cart = await Cart.create({ user_id, created_at: new Date() });
    }
    
    // Lấy thông tin sản phẩm
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    
    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    let cartItem = await CartItem.findOne({
      where: { cart_id: cart.id, product_id }
    });

    // Lấy tổng tồn kho từ tất cả các cơ sở
    const inventories = await Inventory.findAll({ where: { product_id } });
    const totalStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
    
    if (cartItem) {
      if (cartItem.quantity + quantity > totalStock) {
        return res.status(400).json({ success: false, message: `Số lượng yêu cầu vượt quá tồn kho hiện tại (${totalStock}).` });
      }
      // Nếu đã có, tăng số lượng
      await cartItem.update({ 
        quantity: cartItem.quantity + quantity 
      });
    } else {
      if (quantity > totalStock) {
        return res.status(400).json({ success: false, message: `Số lượng yêu cầu vượt quá tồn kho hiện tại (${totalStock}).` });
      }
      // Nếu chưa có, tạo mới
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        quantity,
        price_at_add: product.price
      });
    }
    
    // Lấy lại giỏ hàng với đầy đủ thông tin
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{
        model: CartItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }]
    });
    
    res.json({ success: true, data: updatedCart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật số lượng sản phẩm trong giỏ
exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cartItem = await CartItem.findByPk(req.params.itemId);
    
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    
    if (quantity <= 0) {
      await cartItem.destroy();
      return res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
    }
    
    const inventories = await Inventory.findAll({ where: { product_id: cartItem.product_id } });
    const totalStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
    
    if (quantity > totalStock) {
        return res.status(400).json({ success: false, message: `Số lượng yêu cầu vượt quá tồn kho hiện tại (${totalStock}).` });
    }

    await cartItem.update({ quantity });
    
    res.json({ success: true, data: cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.itemId);
    
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
    }
    
    await cartItem.destroy();
    
    res.json({ success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa toàn bộ giỏ hàng
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ where: { user_id: req.params.userId } });
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy giỏ hàng' });
    }
    
    await CartItem.destroy({ where: { cart_id: cart.id } });
    
    res.json({ success: true, message: 'Đã xóa toàn bộ giỏ hàng' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};