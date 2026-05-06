// services/transactionService.js
import { pool } from "../config/database.js";
import { redisClient } from "../config/redis.js";

class TransactionService {
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
    userAgent,
    fingerprint
  }) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await client.query(
        `INSERT INTO transactions 
         (reference, amount, currency, customer_name, customer_email, customer_whatsapp, 
          cart_items, total_amount, idempotency_key, ip_address, user_agent, fingerprint, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
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
          fingerprint || null,
          "pending"
        ]
      );

      await client.query("COMMIT");

      await redisClient.setEx(
        `txn:${reference}`,
        3600,
        JSON.stringify({ reference, amount, email, status: "pending" })
      );

      return { success: true, id: result.rows[0].id };
    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Transaction creation error:", error);
      if (error.code === "23505") {
        return { success: false, error: "Duplicate transaction reference" };
      }
      return { success: false, error: "Failed to create transaction" };
    } finally {
      client.release();
    }
  }

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
           VALUES ($1, $2)
           ON CONFLICT (transaction_reference) 
           DO UPDATE SET paystack_data = EXCLUDED.paystack_data`,
          [reference, JSON.stringify(paymentData)]
        );
      }

      await redisClient.del(`txn:${reference}`);
      await redisClient.setEx(
        `txn:${reference}`,
        86400,
        JSON.stringify({ reference, status, verifiedAt: new Date().toISOString() })
      );

      return { success: true };
    } catch (error) {
      console.error("Update error:", error);
      return { success: false, error: "Failed to update transaction" };
    } finally {
      client.release();
    }
  }

  async getTransactionByReference(reference) {
    try {
      const cached = await redisClient.get(`txn:${reference}`);
      if (cached) return JSON.parse(cached);

      const result = await pool.query(
        `SELECT reference, status, total_amount, customer_name, customer_email, 
                created_at, cart_items 
         FROM transactions WHERE reference = $1`,
        [reference]
      );

      if (result.rows.length === 0) return null;

      const txn = result.rows[0];
      await redisClient.setEx(`txn:${reference}`, 3600, JSON.stringify(txn));
      return txn;
    } catch (error) {
      console.error("Get transaction error:", error);
      return null;
    }
  }

  async logFailedAttempt(ip, email, reason, amount, fingerprint) {
    try {
      await pool.query(
        `INSERT INTO failed_payments (ip_address, email, reason, attempted_amount, fingerprint)
         VALUES ($1, $2, $3, $4, $5)`,
        [ip, email, reason, amount, fingerprint]
      );
    } catch (e) {
      console.error("Failed to log attempt:", e);
    }
  }
}

export default new TransactionService();