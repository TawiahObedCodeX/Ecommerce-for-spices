import Joi from "joi";

export const validatePaymentInit = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().max(200),
    name: Joi.string().required().min(2).max(100),
    whatsapp: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).allow(""),
    amount: Joi.number().positive().min(1).max(100000).required(),
    cartItems: Joi.array().min(1).required(),
    idempotencyKey: Joi.string().min(8).max(100).required()   // ← FIXED: Not UUID
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ 
      error: "Validation failed", 
      details: error.details[0].message 
    });
  }
  next();
};

export const validatePaymentVerification = (req, res, next) => {
  const schema = Joi.object({
    reference: Joi.string().required().min(5).max(100),
    idempotencyKey: Joi.string().min(8).max(100).optional()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};