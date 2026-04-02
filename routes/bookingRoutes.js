const express = require('express');
const router = express.Router();

const controller = require('../controllers/bookingController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management APIs
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: Get all bookings
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, CANCELLED]
 *     responses:
 *       200:
 *         description: List of bookings
 */
router.get('/', auth.bearerAuth, controller.getBookings);

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created
 *       409:
 *         description: Room already booked
 */
router.post('/', auth.bearerAuth, controller.createBooking);

/**
 * @swagger
 * /bookings/approve/{id}:
 *   put:
 *     summary: Approve booking (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking approved
 */
router.put(
  '/approve/:id',
  auth.bearerAuth,
  role.authorizeRoles('admin'),
  controller.approveBooking
);

/**
 * @swagger
 * /bookings/{id}:
 *   patch:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
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
 *               roomId:
 *                 type: integer
 *               customerId:
 *                 type: integer
 *               fromDate:
 *                 type: string
 *                 example: "2026-04-02"
 *               toDate:
 *                 type: string
 *                 example: "2026-04-05"
 *               status:
 *                 type: string
 *                 enum: [PENDING, CONFIRMED, CANCELLED]
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *       404:
 *         description: Booking, room, or customer not found
 *       409:
 *         description: Room already booked
 */
router.patch('/:id', auth.bearerAuth, controller.patchBooking);

/**
 * @swagger
 * /bookings/reject/{id}:
 *   put:
 *     summary: Reject booking (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking rejected
 */
router.put(
  '/reject/:id',
  auth.bearerAuth,
  role.authorizeRoles('admin'),
  controller.rejectBooking
);

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: Delete a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Booking deleted successfully
 *       404:
 *         description: Booking not found
 */
router.delete('/:id', auth.bearerAuth, controller.deleteBooking);

module.exports = router;
