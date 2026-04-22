import { v4 as uuidv4 } from "uuid";
import paystackService from "../services/paystackService.js";
import transactionService from "../services/transactionService.js";
import { redisClient } from "../config/redis.js";
import { pool } from "../config/database.js";  // ADD THIS MISSING IMPORT

// Initialize payment
export const initializePayment = async (req, res) => {
  const { email, name, whatsapp, amount, cartItems, idempotencyKey } = req.body;
  
  try {
    // Check for duplicate idempotency key
    const existingTxn = await redisClient.get(`idempotent:${idempotencyKey}`);
    if (existingTxn) {
      const cached = JSON.parse(existingTxn);
      return res.status(200).json({
        message: "Payment already initialized",
        authorizationUrl: cached.authorizationUrl,
        reference: cached.reference
      });
    }
    
    // Generate unique reference
    const reference = `MELO_${Date.now()}_${uuidv4().slice(0, 8)}`;
    
    // Store transaction in database
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
    
    // Initialize Paystack payment
    const payment = await paystackService.initializePayment({
      email,
      amount,
      reference,
      metadata: {
        custom_fields: [
          { display_name: "Customer Name", variable_name: "customer_name", value: name },
          { display_name: "WhatsApp", variable_name: "whatsapp", value: whatsapp || "Not provided" },
          { display_name: "Cart Fingerprint", variable_name: "cart_fingerprint", value: req.requestFingerprint }
        ]
      },
      idempotencyKey
    });
    
    if (!payment.success) {
      return res.status(400).json({ error: payment.error });
    }
    
    // Cache idempotency result
    await redisClient.setEx(
      `idempotent:${idempotencyKey}`,
      3600,
      JSON.stringify({
        authorizationUrl: payment.data.authorization_url,
        reference
      })
    );
    
    res.status(200).json({
      success: true,
      authorizationUrl: payment.data.authorization_url,
      reference,
      accessCode: payment.data.access_code
    });
    
  } catch (error) {
    console.error("Payment initialization error:", error);
    res.status(500).json({ error: "Payment initialization failed" });
  }
};

// Verify payment
export const verifyPayment = async (req, res) => {
  const { reference, idempotencyKey } = req.body;
  
  try {
    // Check if already verified (idempotency)
    if (idempotencyKey) {
      const cachedResult = await redisClient.get(`verify:${idempotencyKey}`);
      if (cachedResult) {
        return res.status(200).json(JSON.parse(cachedResult));
      }
    }
    
    // Get transaction details from database
    const transaction = await pool.query(
      "SELECT amount, customer_email FROM transactions WHERE reference = $1",
      [reference]
    );
    
    if (transaction.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    const expectedAmount = transaction.rows[0].amount / 100;
    
    // Verify with Paystack
    const verification = await paystackService.verifyPayment(reference, expectedAmount);
    
    if (!verification.success) {
      // Log failed verification attempt
      await transactionService.logFailedAttempt(
        req.realIp || req.ip,
        transaction.rows[0].customer_email,
        verification.error,
        expectedAmount,
        req.requestFingerprint
      );
      
      return res.status(400).json({ error: verification.error });
    }
    
    // Check if payment was tampered
    if (verification.tampered) {
      await transactionService.logFailedAttempt(
        req.realIp || req.ip,
        transaction.rows[0].customer_email,
        "Amount tampering detected",
        expectedAmount,
        req.requestFingerprint
      );
      return res.status(400).json({ error: "Payment verification failed - amount mismatch" });
    }
    
    // Update transaction status
    await transactionService.updateTransactionStatus(reference, "success", verification.data);
    
    const result = {
      success: true,
      message: "Payment verified successfully",
      data: {
        reference: verification.reference,
        amount: verification.amount,
        status: verification.status,
        transactionDate: verification.data?.transaction_date
      }
    };
    
    // Cache verification result
    if (idempotencyKey) {
      await redisClient.setEx(`verify:${idempotencyKey}`, 86400, JSON.stringify(result));
    }
    
    res.status(200).json(result);
    
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// Get transaction status
export const getTransactionStatus = async (req, res) => {
  const { reference } = req.params;
  
  try {
    // Check Redis cache first
    const cached = await redisClient.get(`txn:${reference}`);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }
    
    const result = await pool.query(
      "SELECT reference, status, created_at, total_amount FROM transactions WHERE reference = $1",
      [reference]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    res.status(200).json(result.rows[0]);
    
  } catch (error) {
    console.error("Status check error:", error);
    res.status(500).json({ error: "Failed to get transaction status" });
  }
};