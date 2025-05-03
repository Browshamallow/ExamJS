// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const adminController = require('../controllers/admin.controller');

router.get(
  "/dashboard",
  authenticateToken,
  authorizeRoles('admin'),
  adminController.getDashboardData
);

module.exports = router;
