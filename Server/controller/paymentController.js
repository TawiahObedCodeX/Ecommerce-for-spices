import axios from "axios";

export const verifyPayment = async (req, res) => {
  const { reference } = req.body;

  if (!reference) return res.status(400).json({ error: "Reference is required" });

  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      }
    );

    const data = response.data;

    if (data.status && data.data.status === "success") {
      // ✅ Payment verified
      // Here you can save the order to DB, send email, etc.
      return res.status(200).json({ message: "Payment verified", data: data.data });
    } else {
      return res.status(400).json({ error: "Payment not successful" });
    }
  } catch (error) {
    console.error("Paystack verification error:", error.message);
    return res.status(500).json({ error: "Server error verifying payment" });
  }
};