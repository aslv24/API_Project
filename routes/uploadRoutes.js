const express = require('express');
const router = express.Router();

const upload = require('../middleware/uploadMiddleware');
const auth = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Upload
 *   description: File upload APIs
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a file (image)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UploadResponse'
 *       401:
 *         description: Missing bearer token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  auth.bearerAuth,
  upload.single('image'),
  (req, res) => {
    res.json({
      message: "File uploaded successfully",
      file: req.file
    });
  }
);

module.exports = router;
