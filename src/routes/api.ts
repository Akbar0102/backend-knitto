import express from "express"
import authController from "../controllers/auth.controller"
import authMiddleware from "../middlewares/authMiddleware"
import invoiceController from "../controllers/invoice.controller"
import shippingController from "../controllers/shipping.controller"
import productController from "../controllers/product.controller"
import orderController from "../controllers/order.controller"

const router = express.Router()

router.post('/auth/login', authController.login)
router.post('/auth/register', authController.register)
router.get('/auth/google', authController.loginOauth)
router.get('/auth/google/callback', authController.loginOauthCallback)

router.post('/invoice', authMiddleware, invoiceController.generateInvoice)

router.get('/shipping/calculate', authMiddleware, shippingController.calculateShipping)

router.get('/product/stock', authMiddleware, productController.stockReport)

router.post('/order', authMiddleware, orderController.createOrder)

export default router