import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config(); // ✅ ensure env is loaded

const PAYSTACK_API = "https://api.paystack.co";

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (!this.secretKey) {
      console.error("❌ PAYSTACK_SECRET_KEY is not set in .env");
    } else {
      // Log first 6 characters for debugging (safe)
      console.log(`🔑 Paystack secret key loaded (starts with: ${this.secretKey.substring(0, 6)}...)`);
    }
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json"
    };
  }

  async initializePayment({ email, amount, reference, metadata, idempotencyKey }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_API}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100),
          currency: "GHS",
          reference,
          metadata,
          callback_url: `${process.env.FRONTEND_URL}/payment/callback`
        },
        {
          headers: {
            ...this.getAuthHeaders(),
            "Idempotency-Key": idempotencyKey
          },
          timeout: 15000
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      const paystackError = error.response?.data;
      console.error("Paystack init error:", paystackError || error.message);
      return {
        success: false,
        error: paystackError?.message || "Payment initialization failed"
      };
    }
  }

  async verifyPayment(reference, expectedAmount = null) {
    try {
      const response = await axios.get(
        `${PAYSTACK_API}/transaction/verify/${reference}`,
        {
          headers: this.getAuthHeaders(),
          timeout: 10000
        }
      );

      const transaction = response.data.data;

      if (expectedAmount && transaction.amount !== Math.round(expectedAmount * 100)) {
        return { success: false, error: "Amount verification failed", tampered: true };
      }

      return {
        success: transaction.status === "success",
        data: transaction,
        reference: transaction.reference,
        amount: transaction.amount / 100,
        status: transaction.status
      };
    } catch (error) {
      console.error("Paystack verify error:", error.response?.data || error.message);
      return { success: false, error: "Verification failed" };
    }
  }

  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret || !signature) return false;

    const expectedSignature = crypto
      .createHmac("sha512", this.webhookSecret)
      .update(JSON.stringify(payload))
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }
}

export default new PaystackService();