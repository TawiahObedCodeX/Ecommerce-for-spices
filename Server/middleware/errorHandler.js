export const errorHandler = (err, req, res, next) => {
    console.error("Error:", {
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      ip: req.ip,
      path: req.path,
      method: req.method
    });
  
    // Don't leak internal errors to client
    if (err.type === "validation") {
      return res.status(400).json({ error: err.message });
    }
  
    if (err.code === "23505") { // PostgreSQL duplicate key
      return res.status(409).json({ error: "Duplicate transaction detected" });
    }
  
    res.status(500).json({ 
      error: process.env.NODE_ENV === "production" 
        ? "An internal server error occurred" 
        : err.message 
    });
  };