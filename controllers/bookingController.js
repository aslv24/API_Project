let bookings = require('../data/bookingData');
let rooms = require('../data/roomData');
let customers = require('../data/customerData');

exports.getBookings = (req, res) => {
const { status } = req.query;
let { page = 1, limit = 5 } = req.query;

page = parseInt(page);
limit = parseInt(limit);

let result = bookings;

if (status) {
    result = bookings.filter(b => b.status === status.toUpperCase());
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

const room = rooms.find(r => r.id == roomId);
const customer = customers.find(c => c.id == customerId);

if (!room || !customer) {
    return res.status(404).json({ message: "Room or Customer not found" });
}

const isBooked = bookings.some(b =>
    b.roomId == roomId &&
    (fromDate <= b.toDate && toDate >= b.fromDate)
);

if (isBooked) {
    return res.status(409).json({ message: "Room already booked" });
}

const booking = {
    id: bookings.length + 1,
    roomId,
    customerId,
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

const nextRoomId = req.body.roomId ?? booking.roomId;
const nextCustomerId = req.body.customerId ?? booking.customerId;
const nextFromDate = req.body.fromDate ?? booking.fromDate;
const nextToDate = req.body.toDate ?? booking.toDate;
const nextStatus = req.body.status ?? booking.status;

const room = rooms.find(r => r.id == nextRoomId);
const customer = customers.find(c => c.id == nextCustomerId);

if (!room || !customer) {
    return res.status(404).json({ message: "Room or Customer not found" });
}

const isBooked = bookings.some(b =>
    b.id != booking.id &&
    b.roomId == nextRoomId &&
    (nextFromDate <= b.toDate && nextToDate >= b.fromDate)
);

if (isBooked) {
    return res.status(409).json({ message: "Room already booked" });
}

booking.roomId = nextRoomId;
booking.customerId = nextCustomerId;
booking.fromDate = nextFromDate;
booking.toDate = nextToDate;
booking.status = nextStatus;

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

booking.status = "CANCELLED";

res.json({ message: "Booking rejected", booking });

};
