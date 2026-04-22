import { pool } from "../config/database.js";
import { redisClient } from "../server.js";

class TransactionService {
  // Store transaction record
  async createTransaction({
    reference,
    amount,
    email,
    name,
    whatsapp,
    cartItems,
    totalAmount,
    idempotencyKey,
    ip,
    userAgent
  }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      
      const result = await client.query(
        `INSERT INTO transactions 
         (reference, amount, currency, customer_name, customer_email, customer_whatsapp, 
          cart_items, total_amount, idempotency_key, ip_address, user_agent, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id`,
        [
          reference,
          Math.round(amount * 100),
          "GHS",
          name,
          email,
          whatsapp || null,
          JSON.stringify(cartItems),
          totalAmount,
          idempotencyKey,
          ip,
          userAgent,
          "pending"
        ]
      );
      
      await client.query("COMMIT");
      
      // Cache transaction in Redis for 1 hour
      await redisClient.setEx(
        `txn:${reference}`,
        3600,
        JSON.stringify({ reference, amount, email, status: "pending" })
      );
      
      return { success: true, id: result.rows[0].id };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction creation error:", error);
      
      if (error.code === "23505") { // Unique violation
        return { success: false, error: "Duplicate transaction reference" };
      }
      
      return { success: false, error: "Failed to create transaction" };
    } finally {
      client.release();
    }
  }

  // Update transaction status
  async updateTransactionStatus(reference, status, paymentData = null) {
    const client = await pool.connect();
    try {
      await client.query(
        `UPDATE transactions 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE reference = $2`,
        [status, reference]
      );
      
      if (paymentData && status === "success") {
        await client.query(
          `INSERT INTO verified_payments (transaction_reference, paystack_data)
           VALUES ($1, $2)`,
          [reference, JSON.stringify(paymentData)]
        );
      }
      
      // Update Redis cache
      await redisClient.del(`txn:${reference}`);
      await redisClient.setEx(
        `txn:${reference}`,
        86400,
        JSON.stringify({ reference, status, verifiedAt: new Date() })
      );
      
      return { success: true };
    } catch (error) {
      console.error("Update error:", error);
      return { success: false, error: "Failed to update transaction" };
    } finally {
      client.release();
    }
  }

  // Log failed payment attempt (fraud detection)
  async logFailedAttempt(ip, email, reason, amount) {
    try {
      await pool.query(
        `INSERT INTO failed_payments (ip_address, email, reason, attempted_amount)
         VALUES ($1, $2, $3, $4)`,
        [ip, email, reason, amount]
      );
      
      // Check for suspicious patterns
      const recentFails = await pool.query(
        `SELECT COUNT(*) FROM failed_payments 
         WHERE ip_address = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
        [ip]
      );
      
      if (parseInt(recentFails.rows[0].count) > 5) {
        console.warn(`🚨 FRAUD ALERT: IP ${ip} has ${recentFails.rows[0].count} failed attempts in last hour`);
        // Could trigger blocking or admin alert here
      }
    } catch (error) {
      console.error("Failed to log attempt:", error);
    }
  }
}

export default new TransactionService();