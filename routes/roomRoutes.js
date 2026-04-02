const express = require('express');
const router = express.Router();

const controller = require('../controllers/roomController');

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management APIs
 */

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get rooms with pagination
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         description: Number of records per page
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: type
 *         description: Filter by room type
 *         schema:
 *           type: string
 *           enum: [Single, Double, Deluxe, Suite]
 *     responses:
 *       200:
 *         description: List of rooms
 */
router.get('/', controller.getRooms);

/**
 * @swagger
 * /rooms/{id}:
 *   patch:
 *     summary: Update a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [Single, Double, Deluxe, Suite, Premium Suite]
 *               price:
 *                 type: integer
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       404:
 *         description: Room not found
 */
router.patch('/:id', controller.patchRoom);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       404:
 *         description: Room not found
 */
router.delete('/:id', controller.deleteRoom);

module.exports = router;
