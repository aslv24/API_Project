const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('../data/userData');
const customers = require('../data/customerData');

const SECRET_KEY = process.env.JWT_SECRET || 'mysecretkey';

const buildAuthResponse = user => {
  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
      customerId: user.customerId
    },
    SECRET_KEY,
    {
      expiresIn: '1h',
      jwtid: `${user.id}-${Date.now()}`
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      customerId: user.customerId
    },
    role: user.role
  };
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new customer and get JWT token
 *     tags: [Auth]
 *     description: Creates a new customer account and returns a token immediately for booking access.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *       409:
 *         description: Username or phone already exists
 */
router.post('/register', (req, res) => {
  const { name, phone, username, password } = req.body;

  if (!name || !phone || !username || !password) {
    return res.status(400).json({
      message: 'Name, phone, username, and password are required'
    });
  }

  const normalizedUsername = String(username).trim().toLowerCase();
  const normalizedPhone = String(phone).trim();

  const existingUser = users.find(user => user.username === normalizedUsername);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  const existingCustomer = customers.find(customer => customer.phone === normalizedPhone);
  if (existingCustomer) {
    return res.status(409).json({ message: 'Phone already exists' });
  }

  const customer = {
    id: customers.length + 1,
    name: String(name).trim(),
    phone: normalizedPhone
  };
  customers.push(customer);

  const user = {
    id: users.length + 1,
    username: normalizedUsername,
    password: bcrypt.hashSync(password, 8),
    role: 'customer',
    customerId: customer.id
  };
  users.push(user);

  const authResponse = buildAuthResponse(user);

  res.status(201).json({
    ...authResponse,
    customer,
    message: 'Registration successful'
  });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login and get JWT token
 *     tags: [Auth]
 *     description: Use `admin/1234`, `raj/1234`, `arun/1234`, or `vijay/1234` to test role-based access.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid password" });
  }

  const authResponse = buildAuthResponse(user);

  res.json({
    ...authResponse,
    message: "Login successful"
  });
});

module.exports = router;
