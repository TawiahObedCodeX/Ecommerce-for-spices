import express from "express";
import { initializePayment, verifyPayment } from "../controllers/paymentController.js";   // fixed
import { validatePaymentInit, validatePaymentVerification } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/initialize", validatePaymentInit, initializePayment);
router.post("/verify", validatePaymentVerification, verifyPayment);

export default router;