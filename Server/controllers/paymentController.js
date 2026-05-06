// controllers/paymentController.js
import { v4 as uuidv4 } from "uuid";
import paystackService from "../services/paystackService.js";
import transactionService from "../services/transactionService.js";
import { redisClient } from "../config/redis.js";

export const initializePayment = async (req, res) => {
  const { email, name, whatsapp, amount, cartItems, idempotencyKey } = req.body;

  try {
    const existingTxn = await redisClient.get(`idempotent:${idempotencyKey}`);
    if (existingTxn) {
      const cached = JSON.parse(existingTxn);
      return res.status(200).json(cached);
    }

    const reference = `MELO_${Date.now()}_${uuidv4().slice(0, 8)}`;

    const transaction = await transactionService.createTransaction({
      reference,
      amount,
      email,
      name,
      whatsapp,
      cartItems,
      totalAmount: amount,
      idempotencyKey,
      ip: req.realIp || req.ip,
      userAgent: req.headers["user-agent"],
      fingerprint: req.requestFingerprint
    });

    if (!transaction.success) {
      return res.status(400).json({ error: transaction.error });
    }

    const payment = await paystackService.initializePayment({
      email,
      amount,
      reference,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: name },
          { display_name: "WhatsApp", variable_name: "whatsapp", value: whatsapp || "Not provided" }
        ]
      },
      idempotencyKey
    });

    if (!payment.success) {
      return res.status(400).json({ error: payment.error });
    }

    await redisClient.setEx(
      `idempotent:${idempotencyKey}`,
      3600,
      JSON.stringify({
        success: true,
        authorizationUrl: payment.data.authorization_url,
        reference
      })
    );

    res.status(200).json({
      success: true,
      authorizationUrl: payment.data.authorization_url,
      reference
    });
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

export const verifyPayment = async (req, res) => {
  const { reference, idempotencyKey } = req.body;

  try {
    if (idempotencyKey) {
      const cached = await redisClient.get(`verify:${idempotencyKey}`);
      if (cached) return res.status(200).json(JSON.parse(cached));
    }

    const verification = await paystackService.verifyPayment(reference);

    if (!verification.success) {
      await transactionService.logFailedAttempt(
        req.realIp || req.ip,
        null,
        verification.error,
        null,
        req.requestFingerprint
      );
      return res.status(400).json({ error: verification.error });
    }

    await transactionService.updateTransactionStatus(reference, "success", verification.data);

    const result = {
      success: true,
      message: "Payment verified successfully",
      reference,
      status: "success"
    };

    if (idempotencyKey) {
      await redisClient.setEx(`verify:${idempotencyKey}`, 86400, JSON.stringify(result));
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// New endpoint for success page
export const getOrderDetails = async (req, res) => {
  const { reference } = req.params;
  try {
    const order = await transactionService.getTransactionByReference(reference);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch order" });
  }
};