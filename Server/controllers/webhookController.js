import paystackService from "../services/paystackService.js";
import { pool } from "../config/database.js";

export const handlePaystackWebhook = async (req, res) => {
  const signature = req.headers["x-paystack-signature"];
  
  if (!paystackService.verifyWebhookSignature(req.body, signature)) {
    console.error("Invalid webhook signature");
    return res.status(401).json({ error: "Invalid signature" });
  }
  
  const event = req.body;
  
  try {
    switch (event.event) {
      case "charge.success":
        await handleSuccessfulCharge(event.data);
        break;
      case "charge.failed":
        await handleFailedCharge(event.data);
        break;
      default:
        console.log(`Unhandled event type: ${event.event}`);
    }
    
    res.status(200).json({ received: true });
    
  } catch (error) {
    console.error("Webhook processing error:", error);
    res.status(200).json({ received: true, error: error.message });
  }
};

async function handleSuccessfulCharge(data) {
  const { reference } = data;
  console.log(`✅ Webhook: Successful charge for ${reference}`);
  
  await pool.query(
    `UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE reference = $2`,
    ["success", reference]
  );
  
  await pool.query(
    `INSERT INTO verified_payments (transaction_reference, paystack_data)
     VALUES ($1, $2)
     ON CONFLICT (transaction_reference) DO UPDATE SET paystack_data = EXCLUDED.paystack_data`,
    [reference, JSON.stringify(data)]
  );
}

async function handleFailedCharge(data) {
  console.log(`❌ Webhook: Failed charge for ${data.reference}`);
  await pool.query(
    `UPDATE transactions SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE reference = $2`,
    ["failed", data.reference]
  );
}