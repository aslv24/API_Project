let rooms = require('../data/roomData');
const { getPagination } = require('../utils/requestValidators');

const ROOM_TYPES = ['Single', 'Double', 'Deluxe', 'Suite', 'Premium Suite'];

exports.getRooms = (req, res) => {
let { type } = req.query;
const pagination = getPagination(req.query);

if (pagination.error) {
    return res.status(400).json({ message: pagination.error });
}

const { page, limit } = pagination;

let filtered = rooms;

if (type) {
    filtered = rooms.filter(r =>
        r.type.toLowerCase() === String(type).toLowerCase()
    );
}

const start = (page - 1) * limit;
const end = page * limit;

res.json({
    total: filtered.length,
    page,
    limit,
    data: filtered.slice(start, end)
});

};

exports.patchRoom = (req, res) => {
const room = rooms.find(r => r.id == req.params.id);

if (!room) {
    return res.status(404).json({ message: "Room not found" });
}

const { type, price, available } = req.body;

if (type !== undefined) {
    if (!ROOM_TYPES.includes(type)) {
        return res.status(400).json({
            message: `Room type must be one of: ${ROOM_TYPES.join(', ')}`
        });
    }
    room.type = type;
}

if (price !== undefined) {
    if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({ message: "Price must be a positive number" });
    }
    room.price = price;
}

if (available !== undefined) {
    if (typeof available !== 'boolean') {
        return res.status(400).json({ message: "Available must be true or false" });
    }
    room.available = available;
}

res.json({
    message: "Room updated successfully",
    room
});
};

exports.deleteRoom = (req, res) => {
const roomIndex = rooms.findIndex(r => r.id == req.params.id);

if (roomIndex === -1) {
    return res.status(404).json({ message: "Room not found" });
}

const deletedRoom = rooms.splice(roomIndex, 1)[0];

res.json({
    message: "Room deleted successfully",
    room: deletedRoom
});
};
