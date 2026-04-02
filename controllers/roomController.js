let rooms = require('../data/roomData');

exports.getRooms = (req, res) => {
let { page = 1, limit = 5, type } = req.query;

page = parseInt(page);
limit = parseInt(limit);

let filtered = rooms;

if (type) {
    filtered = rooms.filter(r =>
        r.type.toLowerCase() === type.toLowerCase()
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
    room.type = type;
}

if (price !== undefined) {
    room.price = price;
}

if (available !== undefined) {
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
