// routes/adminProducts.js
// Commit: Support both file upload AND external URLs for image/video + fix auth + flexible input

import express from "express";
import multer from "multer";
import path from "path";
import { adminAuth } from "../middleware/auth.js";
import pool from "../Config/db.js";

const router = express.Router();

// Only use multer when files are actually uploaded
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + unique + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm|mov/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype);
    return extOk && mimeOk ? cb(null, true) : cb(new Error("Invalid file type"));
  },
});

// Helper: Validate URL format
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

// POST /api/admin/products - Create product (supports file OR URL)
router.post("/", adminAuth, upload.fields([{ name: "image" }, { name: "video" }]), async (req, res) => {
  try {
    let { name, category, description, price, rating, image_url, video_url } = req.body;

    // Fix typo from Postman
    if (!name && req.body.namne) name = req.body.namne;

    if (!name || !category || !price) {
      return res.status(400).json({ error: "Name, category, and price are required" });
    }

    // Determine final image/video URLs
    let finalImageUrl = image_url?.trim();
    let finalVideoUrl = video_url?.trim();

    // If file uploaded → use uploaded path
    if (req.files?.image?.[0]) {
      finalImageUrl = `/uploads/${req.files.image[0].filename}`;
    }
    if (req.files?.video?.[0]) {
      finalVideoUrl = `/uploads/${req.files.video[0].filename}`;
    }

    // If no file and URL provided → validate URL
    if (finalImageUrl && !finalImageUrl.startsWith("/uploads/") && !isValidUrl(finalImageUrl)) {
      return res.status(400).json({ error: "Invalid image URL" });
    }
    if (finalVideoUrl && !finalVideoUrl.startsWith("/uploads/") && !isValidUrl(finalVideoUrl)) {
      return res.status(400).json({ error: "Invalid video URL" });
    }

    // Both image and video must exist
    if (!finalImageUrl || !finalVideoUrl) {
      return res.status(400).json({ error: "Please provide image and video (file or valid URL)" });
    }

    const result = await pool.query(
      `INSERT INTO products 
       (name, category, description, price, rating, image_url, video_url, admin_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        category,
        description || null,
        parseFloat(price),
        parseInt(rating) || 0,
        finalImageUrl,
        finalVideoUrl,
        req.admin.id,
      ]
    );

    res.status(201).json({
      message: "Product added successfully!",
      product: result.rows[0],
    });
  } catch (err) {
    console.error("Add product error:", err.message);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// GET all products (admin panel)
router.get("/", adminAuth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, a.full_name as added_by
       FROM products p
       LEFT JOIN admins a ON p.admin_id = a.id
       WHERE p.is_active = true
       ORDER BY p.created_at DESC`
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET all products (public for clients)
router.get("/public", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, category, description, price, rating, image_url, video_url, created_at
       FROM products
       WHERE is_active = true
       ORDER BY created_at DESC`
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// UPDATE product by ID (supports file OR URL)
router.put("/:id", adminAuth, upload.fields([{ name: "image" }, { name: "video" }]), async (req, res) => {
  try {
    const { id } = req.params;
    let { name, category, description, price, rating, image_url, video_url } = req.body;

    const updates = [];
    const values = [];
    let idx = 1;

    if (name) { updates.push(`name = $${idx++}`); values.push(name); }
    if (category) { updates.push(`category = $${idx++}`); values.push(category); }
    if (description !== undefined) { updates.push(`description = $${idx++}`); values.push(description || null); }
    if (price) { updates.push(`price = $${idx++}`); values.push(parseFloat(price)); }
    if (rating) { updates.push(`rating = $${idx++}`); values.push(parseInt(rating)); }

    // Handle image
    if (req.files?.image?.[0]) {
      updates.push(`image_url = $${idx++}`);
      values.push(`/uploads/${req.files.image[0].filename}`);
    } else if (image_url?.trim()) {
      if (!isValidUrl(image_url)) return res.status(400).json({ error: "Invalid image URL" });
      updates.push(`image_url = $${idx++}`);
      values.push(image_url.trim());
    }

    // Handle video
    if (req.files?.video?.[0]) {
      updates.push(`video_url = $${idx++}`);
      values.push(`/uploads/${req.files.video[0].filename}`);
    } else if (video_url?.trim()) {
      if (!isValidUrl(video_url)) return res.status(400).json({ error: "Invalid video URL" });
      updates.push(`video_url = $${idx++}`);
      values.push(video_url.trim());
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    values.push(id);
    updates.push(`updated_at = NOW()`);

    const result = await pool.query(
      `UPDATE products SET ${updates.join(", ")} WHERE id = $${idx} AND admin_id = $1 RETURNING *`,
      [req.admin.id, ...values]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found or unauthorized" });
    }

    res.json({ message: "Product updated!", product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// DELETE by ID
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `UPDATE products SET is_active = false WHERE id = $1 AND admin_id = $2 RETURNING name`,
      [id, req.admin.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Product not found or not yours" });
    }

    res.json({ message: `Product "${result.rows[0].name}" deleted` });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;