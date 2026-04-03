const bcrypt = require('bcryptjs');
const customers = require('./customerData');

const defaultPassword = bcrypt.hashSync('1234', 8);

const users = [
  {
    id: 1,
    username: 'admin',
    password: defaultPassword,
    role: 'admin',
    customerId: null
  },
  ...customers.slice(0, 60).map((customer, index) => {
    const fallbackUsername = `customer${customer.id}`;
    const preferredUsernames = ['raj', 'arun', 'vijay'];

    return {
      id: index + 2,
      username: preferredUsernames[index] || fallbackUsername,
      password: defaultPassword,
      role: 'customer',
      customerId: customer.id
    };
  })
];

module.exports = users;
