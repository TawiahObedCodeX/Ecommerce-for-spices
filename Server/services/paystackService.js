import axios from "axios";
import crypto from "crypto";

const PAYSTACK_API = "https://api.paystack.co";

class PaystackService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
    this.webhookSecret = process.env.WEBHOOK_SECRET;
  }

  getAuthHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      "Content-Type": "application/json"
    };
  }

  // Initialize payment
  async initializePayment({ email, amount, reference, metadata, idempotencyKey }) {
    try {
      const response = await axios.post(
        `${PAYSTACK_API}/transaction/initialize`,
        {
          email,
          amount: Math.round(amount * 100), // Convert to pesewas
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
          timeout: 10000
        }
      );

      return {
        success: true,
        data: response.data.data
      };
    } catch (error) {
      console.error("Paystack init error:", error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || "Payment initialization failed"
      };
    }
  }

  // Verify payment with additional security checks
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

      // CRITICAL: Verify amount hasn't been tampered
      if (expectedAmount && transaction.amount !== Math.round(expectedAmount * 100)) {
        console.error(`Amount mismatch for ${reference}: Expected ${expectedAmount}, Got ${transaction.amount / 100}`);
        return {
          success: false,
          error: "Amount verification failed",
          tampered: true
        };
      }

      // Verify currency
      if (transaction.currency !== "GHS") {
        return {
          success: false,
          error: "Invalid currency"
        };
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
      return {
        success: false,
        error: "Verification failed"
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    if (!this.webhookSecret || !signature) {
      return false;
    }

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