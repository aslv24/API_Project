const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('1234', 8),
    role: 'admin',
    customerId: null
  },
  {
    id: 2,
    username: 'raj',
    password: bcrypt.hashSync('1234', 8),
    role: 'customer',
    customerId: 1
  },
  {
    id: 3,
    username: 'arun',
    password: bcrypt.hashSync('1234', 8),
    role: 'customer',
    customerId: 2
  },
  {
    id: 4,
    username: 'vijay',
    password: bcrypt.hashSync('1234', 8),
    role: 'customer',
    customerId: 3
  }
];

module.exports = users;
