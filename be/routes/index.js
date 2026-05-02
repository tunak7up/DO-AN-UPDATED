const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const categoryRoutes = require('./categoryRoutes');
const orderRoutes = require('./orderRoutes');
const cartRoutes = require('./cartRoutes');
const storeRoutes = require('./storeRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const taskRoutes = require('./taskRoutes');
const authRoutes = require('./authRoutes');
const serviceRoutes = require('./serviceRoutes');
const serviceCategoryRoutes = require('./serviceCategoryRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const storeUserRoutes = require('./storeUserRoutes');
const importRoutes = require('./importRoutes');
const shippingRoutes = require('./shippingRoutes');

// API Routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/stores', storeRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/tasks', taskRoutes);
router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/service-categories', serviceCategoryRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/store-users', storeUserRoutes);
router.use('/import', importRoutes);
router.use('/shipping', shippingRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date()
  });
});

module.exports = router;