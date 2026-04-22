import Joi from "joi";

// Payment initialization validation
export const validatePaymentInit = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().max(200),
    name: Joi.string().required().min(2).max(100),
    whatsapp: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).allow(""),
    amount: Joi.number().positive().min(1).max(100000).required(),
    cartItems: Joi.array().min(1).required(),
    idempotencyKey: Joi.string().uuid().required()
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

// Payment verification validation
export const validatePaymentVerification = (req, res, next) => {
  const schema = Joi.object({
    reference: Joi.string().required().min(10).max(100),
    idempotencyKey: Joi.string().uuid()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};