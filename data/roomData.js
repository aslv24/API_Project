const roomTypes = ['Single', 'Double', 'Deluxe', 'Suite', 'Premium Suite'];
const basePrices = {
  Single: 1400,
  Double: 2400,
  Deluxe: 3600,
  Suite: 5600,
  'Premium Suite': 8200
};

const rooms = Array.from({ length: 60 }, (_, index) => {
  const id = index + 1;
  const type = roomTypes[index % roomTypes.length];

  return {
    id,
    type,
    price: basePrices[type] + (Math.floor(index / roomTypes.length) * 250),
    available: id % 7 !== 0
  };
});

module.exports = rooms;
