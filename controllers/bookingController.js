let bookings = require('../data/bookingData');
let rooms = require('../data/roomData');
let customers = require('../data/customerData');
const {
  getPagination,
  parsePositiveInteger,
  validateDateRange
} = require('../utils/requestValidators');

const ALLOWED_BOOKING_STATUSES = ['PENDING', 'CONFIRMED', 'REJECTED'];
const normalizeBookingStatus = value => {
  const normalized = String(value).trim().toUpperCase();
  return normalized === 'CANCELLED' ? 'REJECTED' : normalized;
};

const isAdmin = req => req.user.role === 'admin';

const canAccessBooking = (req, booking) =>
  isAdmin(req) || booking.customerId === req.user.customerId;

exports.getBookings = (req, res) => {
const { status } = req.query;
const pagination = getPagination(req.query);

if (pagination.error) {
    return res.status(400).json({ message: pagination.error });
}

const { page, limit } = pagination;

let result = bookings;

if (!isAdmin(req)) {
    result = result.filter(b => b.customerId === req.user.customerId);
}

if (status) {
    const normalizedStatus = normalizeBookingStatus(status);

    if (!ALLOWED_BOOKING_STATUSES.includes(normalizedStatus)) {
        return res.status(400).json({
            message: "Status must be one of PENDING, CONFIRMED, or REJECTED"
        });
    }

    result = result.filter(b => b.status === normalizedStatus);
}

const start = (page - 1) * limit;
const end = page * limit;

res.json({
    total: result.length,
    page,
    limit,
    data: result.slice(start, end)
});

};

exports.createBooking = (req, res) => {
const { roomId, customerId, fromDate, toDate } = req.body;
const parsedRoomId = parsePositiveInteger(roomId);
const parsedCustomerId = isAdmin(req)
    ? parsePositiveInteger(customerId)
    : req.user.customerId;
const dateRangeError = validateDateRange(fromDate, toDate);

if (!parsedRoomId) {
    return res.status(400).json({ message: "roomId must be a positive integer" });
}

if (isAdmin(req) && !parsedCustomerId) {
    return res.status(400).json({ message: "customerId must be a positive integer for admin bookings" });
}

if (dateRangeError) {
    return res.status(400).json({ message: dateRangeError });
}

const effectiveCustomerId = parsedCustomerId;

const room = rooms.find(r => r.id === parsedRoomId);
const customer = customers.find(c => c.id === effectiveCustomerId);

if (!room || !customer) {
    return res.status(404).json({ message: "Room or Customer not found" });
}

if (!room.available) {
    return res.status(409).json({ message: "Room is currently unavailable" });
}

const isBooked = bookings.some(b =>
    b.roomId === parsedRoomId &&
    (fromDate <= b.toDate && toDate >= b.fromDate)
);

if (isBooked) {
    return res.status(409).json({ message: "Room already booked" });
}

const booking = {
    id: bookings.length + 1,
    roomId: parsedRoomId,
    customerId: effectiveCustomerId,
    createdByUserId: req.user.userId,
    fromDate,
    toDate,
    status: "PENDING"
};

bookings.push(booking);

res.status(201).json({
    message: "Booking created, waiting for approval",
    booking
});

};

exports.patchBooking = (req, res) => {
const booking = bookings.find(b => b.id == req.params.id);

if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
}

if (!canAccessBooking(req, booking)) {
    return res.status(403).json({ message: "Access denied" });
}

const nextRoomId = req.body.roomId ?? booking.roomId;
const parsedNextRoomId = parsePositiveInteger(nextRoomId);
const nextCustomerId = isAdmin(req)
    ? (req.body.customerId ?? booking.customerId)
    : booking.customerId;
const parsedNextCustomerId = parsePositiveInteger(nextCustomerId);
const nextFromDate = req.body.fromDate ?? booking.fromDate;
const nextToDate = req.body.toDate ?? booking.toDate;
const nextStatus = isAdmin(req)
    ? (req.body.status ?? booking.status)
    : booking.status;
const normalizedNextStatus = normalizeBookingStatus(nextStatus);
const dateRangeError = validateDateRange(nextFromDate, nextToDate);

if (!parsedNextRoomId || !parsedNextCustomerId) {
    return res.status(400).json({
        message: "roomId and customerId must be positive integers"
    });
}

const room = rooms.find(r => r.id === parsedNextRoomId);
const customer = customers.find(c => c.id === parsedNextCustomerId);

if (!room || !customer) {
    return res.status(404).json({ message: "Room or Customer not found" });
}

if (dateRangeError) {
    return res.status(400).json({ message: dateRangeError });
}

if (isAdmin(req) && !ALLOWED_BOOKING_STATUSES.includes(normalizedNextStatus)) {
    return res.status(400).json({
        message: "Status must be one of PENDING, CONFIRMED, or REJECTED"
    });
}

const isBooked = bookings.some(b =>
    b.id != booking.id &&
    b.roomId === parsedNextRoomId &&
    (nextFromDate <= b.toDate && nextToDate >= b.fromDate)
);

if (isBooked) {
    return res.status(409).json({ message: "Room already booked" });
}

booking.roomId = parsedNextRoomId;
booking.customerId = parsedNextCustomerId;
booking.fromDate = nextFromDate;
booking.toDate = nextToDate;
booking.status = normalizedNextStatus;

res.json({
    message: "Booking updated successfully",
    booking
});
};

exports.approveBooking = (req, res) => {
const booking = bookings.find(b => b.id == req.params.id);

if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
}

booking.status = "CONFIRMED";

res.json({ message: "Booking approved", booking });

};

exports.deleteBooking = (req, res) => {
const bookingIndex = bookings.findIndex(b => b.id == req.params.id);

if (bookingIndex === -1) {
    return res.status(404).json({ message: "Booking not found" });
}

if (!canAccessBooking(req, bookings[bookingIndex])) {
    return res.status(403).json({ message: "Access denied" });
}

const deletedBooking = bookings.splice(bookingIndex, 1)[0];

res.json({
    message: "Booking deleted successfully",
    booking: deletedBooking
});
};

exports.rejectBooking = (req, res) => {
const booking = bookings.find(b => b.id == req.params.id);

if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
}

booking.status = "REJECTED";

res.json({ message: "Booking rejected", booking });

};
