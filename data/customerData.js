const firstNames = [
  'Raj', 'Arun', 'Vijay', 'Kumar', 'Suresh', 'Ravi', 'Manoj', 'Dinesh',
  'Prakash', 'Karthik', 'Rahul', 'Ajay', 'Surya', 'Ganesh', 'Bala', 'Hari',
  'Senthil', 'Saravanan', 'Naveen', 'Deepak'
];

const lastNames = [
  'Kumar', 'Sharma', 'Patel', 'Reddy', 'Verma', 'Iyer',
  'Nair', 'Mehta', 'Singh', 'Joshi'
];

const customers = Array.from({ length: 120 }, (_, index) => {
  const id = index + 1;
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];

  return {
    id,
    name: `${firstName} ${lastName}`,
    phone: `9${String(id).padStart(9, '0')}`
  };
});

module.exports = customers;
