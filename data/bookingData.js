const statuses = ['PENDING', 'CONFIRMED', 'CANCELLED'];
const monthByStatus = {
  PENDING: '04',
  CONFIRMED: '05',
  CANCELLED: '06'
};

const bookings = statuses.flatMap((status, groupIndex) =>
  Array.from({ length: 50 }, (_, index) => {
    const id = groupIndex * 50 + index + 1;
    const customerId = (index % 60) + 1;
    const day = String((index % 25) + 1).padStart(2, '0');
    const checkoutDay = String((index % 25) + 3).padStart(2, '0');

    return {
      id,
      roomId: ((index * 7) + (groupIndex * 11)) % 60 + 1,
      customerId,
      createdByUserId: customerId + 1,
      fromDate: `2026-${monthByStatus[status]}-${day}`,
      toDate: `2026-${monthByStatus[status]}-${checkoutDay}`,
      status
    };
  })
);

module.exports = bookings;
