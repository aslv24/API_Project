const bcrypt = require('bcryptjs');
const customers = require('./customerData');

const defaultPassword = bcrypt.hashSync('1234', 8);

const users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@mail.com',
    password: defaultPassword,
    role: 'admin',
    customerId: null
  },
  ...customers.slice(0, 60).map((customer, index) => {
    return {
      id: index + 2,
      name: customer.name,
      email: customer.email,
      password: defaultPassword,
      role: 'customer',
      customerId: customer.id
    };
  })
];

module.exports = users;
