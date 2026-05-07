import express from "express";
import { initializePayment, verifyPayment, getOrderDetails } from "../controllers/paymentController.js";
import { validatePaymentInit, validatePaymentVerification } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/initialize", validatePaymentInit, initializePayment);
router.post("/verify", validatePaymentVerification, verifyPayment);
router.get("/order/:reference", getOrderDetails);

export default router;